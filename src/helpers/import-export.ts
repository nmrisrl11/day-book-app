import type { InvitationRecord } from "@/lib/db";
import { SettingsSchema } from "@/schema/settings-schema";
import type { Birthday } from "@/types/birthday";
import type { z } from "zod";

type SettingsState = z.infer<typeof SettingsSchema>;

import { NOTE_MAX_COUNT, NOTE_MAX_LENGTH } from "@/schema/validation-constants";

export function exportBirthdays(birthdays: Birthday[]) {
	const dataStr = JSON.stringify(birthdays, null, 2);
	const blob = new Blob([dataStr], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `day-book-export-${new Date().toISOString().split("T")[0]}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function parseImportedBirthdays(fileText: string): Birthday[] {
	try {
		const parsed = JSON.parse(fileText);
		if (!Array.isArray(parsed)) {
			throw new Error("Imported data must be an array.");
		}

		// Basic schema validation
		const validBirthdays = parsed
			.filter((item) => {
				if (typeof item !== "object" || item === null) return false;
				if (typeof item.id !== "string" || !item.id) return false;
				if (typeof item.name !== "string" || !item.name) return false;
				if (typeof item.birthday !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(item.birthday)) {
					return false;
				}
				const dateObj = new Date(item.birthday);
				if (isNaN(dateObj.getTime()) || dateObj.toISOString().split("T")[0] !== item.birthday) {
					return false;
				}

				const [year, month, day] = item.birthday.split("-").map(Number);
				const localDate = new Date(year, month - 1, day);
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				if (localDate > today) {
					return false;
				}
				if (typeof item.avatar === "string" && item.avatar !== "") {
					if (
						!item.avatar.startsWith("data:image/jpeg;base64,") &&
						!item.avatar.startsWith("data:image/png;base64,") &&
						!item.avatar.startsWith("data:image/webp;base64,")
					) {
						return false;
					}
					// Enforce 2MB limit
					const base64Part = item.avatar.split(",")[1] || "";
					const paddingCount = (base64Part.match(/=+$/) || [""])[0].length;
					const sizeInBytes = base64Part.length * 0.75 - paddingCount;
					if (sizeInBytes > 2 * 1024 * 1024) return false;
				}
				return true;
			})
			.map((item: Record<string, unknown>) => {
				let parsedNotes: string[] = [];
				if (Array.isArray(item.notes)) {
					parsedNotes = item.notes
						.filter((n) => typeof n === "string")
						.map((n) => (n as string).trim())
						.filter((n) => n.length > 0)
						.map((n) => n.substring(0, NOTE_MAX_LENGTH))
						.slice(0, NOTE_MAX_COUNT);
				}

				return {
					id: item.id,
					name: item.name,
					birthday: item.birthday,
					avatar: typeof item.avatar === "string" && item.avatar !== "" ? item.avatar : undefined,
					relationship: typeof item.relationship === "string" ? item.relationship : "Other",
					notes: parsedNotes,
				};
			}) as Birthday[];

		if (validBirthdays.length === 0 && parsed.length > 0) {
			throw new Error("No valid birthday records found in the imported file.");
		}

		return validBirthdays;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "Invalid JSON file.");
	}
}

export function exportInvitations(invitations: InvitationRecord[]) {
	const dataStr = JSON.stringify(invitations, null, 2);
	const blob = new Blob([dataStr], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `day-book-invitations-${new Date().toISOString().split("T")[0]}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function parseImportedInvitations(fileText: string | undefined): InvitationRecord[] {
	if (!fileText) return [];

	try {
		const parsed = JSON.parse(fileText);
		if (!Array.isArray(parsed)) {
			// Backward compatibility: If it's not an array, it might be an older backup without invitations
			return [];
		}

		// Basic schema validation
		const validInvitations = parsed
			.filter((item) => {
				if (typeof item !== "object" || item === null) return false;
				if (typeof item.id !== "string" || !item.id) return false;
				if (typeof item.name !== "string" || !item.name) return false;
				if (typeof item.createdAt !== "number") return false;
				if (typeof item.token !== "string" || !item.token) return false;
				// expiresAt can be null, undefined, or number
				if (
					item.expiresAt !== undefined &&
					item.expiresAt !== null &&
					typeof item.expiresAt !== "number"
				) {
					return false;
				}
				return true;
			})
			.map((item: Record<string, unknown>) => ({
				id: item.id,
				name: item.name,
				createdAt: item.createdAt,
				expiresAt: item.expiresAt,
				token: item.token,
			})) as InvitationRecord[];

		return validInvitations;
	} catch (error) {
		// If it fails to parse, it might be an older backup, just return empty array instead of throwing
		// unless it's a completely invalid JSON in which case the birthdays parse would have already failed.
		return [];
	}
}

export function exportSettings(settings: SettingsState) {
	const dataStr = JSON.stringify(settings, null, 2);
	const blob = new Blob([dataStr], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `day-book-settings-${new Date().toISOString().split("T")[0]}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function parseImportedSettings(fileText: string): SettingsState {
	try {
		const parsed = JSON.parse(fileText);
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
			throw new Error("Settings data must be a JSON object.");
		}

		// Validate against our schema
		const result = SettingsSchema.safeParse(parsed);
		if (!result.success) {
			const errors = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
			throw new Error(`Validation failed: ${errors}`);
		}

		return result.data;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "Invalid JSON file.");
	}
}
