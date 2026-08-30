import { inviteeSchema } from "@/schema/birthday-schema";

export interface InvitationPayload {
	v: number;
	n: string; // Inviter name
	e?: number; // Expiration timestamp (ms), optional for legacy
}

export interface ResponsePayload {
	v: number;
	n: string; // Invitee name
	b: string; // Birthday (YYYY-MM-DD)
	e: number; // Expiration timestamp (ms)
	g?: string[]; // Gift ideas
}

function encodeBase64Url(str: string): string {
	const bytes = new TextEncoder().encode(str);
	const binString = String.fromCodePoint(...bytes);
	const base64 = btoa(binString);
	return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeBase64Url(str: string): string {
	let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
	while (base64.length % 4) {
		base64 += "=";
	}
	const binString = atob(base64);
	const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
	return new TextDecoder().decode(bytes);
}

/**
 * Generates a Base64Url-encoded invitation payload for an inviter.
 * Note: This is an unencrypted, forgeable client-side convenience token, not a secure cryptographic token.
 * It contains the inviter's name, version, and a 24-hour expiration timestamp.
 *
 * Example Result: "eyJ2IjoxLCJuIjoiSm9obiIsImUiOjE3MTkwMDAwMDAwMDB9"
 */
export function generateInvitationToken(name: string, expirationTime?: number | null): string {
	// For "no expiration", use the maximum safe integer for backward compatibility
	const e =
		expirationTime ??
		(expirationTime === null ? 8640000000000000 : Date.now() + 24 * 60 * 60 * 1000);
	const payload: InvitationPayload = { v: 1, n: name.trim(), e };
	return encodeBase64Url(JSON.stringify(payload));
}

/**
 * Parses and validates an invitation payload.
 * Returns the payload if it is structurally valid, matches the current version, and hasn't expired.
 * Note: Expiration is client-enforced and the payload is not cryptographically authenticated.
 *
 * Example Result: { v: 1, n: "John", e: 1719000000000 }
 * Returns `null` if the token is invalid, corrupted, or expired.
 */
export function parseInvitationToken(token: string): InvitationPayload | null {
	try {
		const payload = JSON.parse(decodeBase64Url(token));
		if (
			payload &&
			payload.v === 1 &&
			typeof payload.n === "string" &&
			(payload.e === undefined || (typeof payload.e === "number" && Date.now() <= payload.e))
		) {
			if (payload.e === undefined) {
				payload.e = Number.MAX_SAFE_INTEGER;
			}
			return payload as InvitationPayload;
		}
		return null;
	} catch {
		return null;
	}
}

/**
 * Generates a Base64Url-encoded response payload from the invitee.
 * Note: This is an unencrypted, forgeable client-side convenience token.
 * It contains the invitee's name, birthday, version, optional gift ideas, and a 12-hour expiration timestamp.
 *
 * Example Payload: { v: 1, n: "Sarah", b: "1995-01-15", e: 1719000000000, g: ["Shoes"] }
 * Example Token: "eyJ2IjoxLCJuIjoiU2FyYWgiLCJiIjoiMTk5NS0wMS0xNSIsImUiOjE3MTkwMDAwMDAwMDAsImciOlsiU2hvZXMiXX0"
 */
export function generateResponseToken(
	name: string,
	birthday: string,
	giftIdeas?: string[],
): string {
	const expiration = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
	const payload: ResponsePayload = { v: 1, n: name.trim(), b: birthday, e: expiration };
	if (giftIdeas && giftIdeas.length > 0) {
		payload.g = giftIdeas;
	}
	return encodeBase64Url(JSON.stringify(payload));
}

/**
 * Parses and validates a response payload against the birthday schema.
 * Returns the payload if structurally valid, matches the version, and hasn't expired.
 * Note: Expiration is client-enforced and the payload is not cryptographically authenticated.
 *
 * Example Result: { v: 1, n: "Sarah", b: "1995-01-15", e: 1719000000000, g: ["Shoes"] }
 * Returns `null` if the token is invalid, corrupted, or expired.
 */
export function parseResponseToken(token: string): ResponsePayload | null {
	try {
		const payload = JSON.parse(decodeBase64Url(token));
		if (
			payload &&
			payload.v === 1 &&
			typeof payload.n === "string" &&
			typeof payload.b === "string" &&
			typeof payload.e === "number" &&
			Date.now() <= payload.e
		) {
			const validation = inviteeSchema.safeParse({
				name: payload.n,
				birthday: payload.b,
				giftIdeas: payload.g || [],
			});
			if (validation.success) {
				return {
					...payload,
					n: validation.data.name,
					b: validation.data.birthday,
					g: validation.data.giftIdeas,
				} as ResponsePayload;
			}
		}
		return null;
	} catch {
		return null;
	}
}
