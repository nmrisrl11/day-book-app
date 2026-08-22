import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	generateInvitationToken,
	parseInvitationToken,
	generateResponseToken,
	parseResponseToken,
} from "../invitation-token";

describe("invitation-token", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("Invitation Token", () => {
		it("should generate and parse a valid invitation token", () => {
			const token = generateInvitationToken("Alice");
			expect(token).toBeDefined();

			const payload = parseInvitationToken(token);
			expect(payload).not.toBeNull();
			expect(payload?.n).toBe("Alice");
			expect(payload?.v).toBe(1);
			expect(payload?.e).toBeGreaterThan(Date.now());
		});

		it("should trim the inviter name", () => {
			const token = generateInvitationToken("  Bob  ");
			const payload = parseInvitationToken(token);
			expect(payload?.n).toBe("Bob");
		});

		it("should return null for expired invitation tokens", () => {
			const token = generateInvitationToken("Charlie");

			// Fast-forward time by 24 hours + 1 second
			vi.advanceTimersByTime(24 * 60 * 60 * 1000 + 1000);

			const payload = parseInvitationToken(token);
			expect(payload).toBeNull();
		});

		it("should return null for invalid base64 or JSON", () => {
			expect(parseInvitationToken("invalid-base64")).toBeNull();
			// Base64 for "not a json"
			expect(parseInvitationToken("bm90IGEganNvbg==")).toBeNull();
		});

		it("should return null if version is unsupported", () => {
			// Mocking an older version payload
			const badPayload = btoa(JSON.stringify({ v: 2, n: "Alice", e: Date.now() + 10000 }));
			expect(parseInvitationToken(badPayload)).toBeNull();
		});
	});

	describe("Response Token", () => {
		it("should generate and parse a valid response token", () => {
			const token = generateResponseToken("David", "1990-10-10");
			expect(token).toBeDefined();

			const payload = parseResponseToken(token);
			expect(payload).not.toBeNull();
			expect(payload?.n).toBe("David");
			expect(payload?.b).toBe("1990-10-10");
			expect(payload?.v).toBe(1);
		});

		it("should trim the invitee name", () => {
			const token = generateResponseToken("  Eve  ", "1985-05-05");
			const payload = parseResponseToken(token);
			expect(payload?.n).toBe("Eve");
		});

		it("should return null for expired response tokens", () => {
			const token = generateResponseToken("Frank", "1999-12-31");

			// Fast-forward time by 24 hours + 1 second
			vi.advanceTimersByTime(24 * 60 * 60 * 1000 + 1000);

			const payload = parseResponseToken(token);
			expect(payload).toBeNull();
		});

		it("should return null if birthday violates schema (e.g. invalid date string format)", () => {
			// e.g. "not-a-date"
			const token = generateResponseToken("Grace", "not-a-date");
			const payload = parseResponseToken(token);
			// Should fail zod schema parsing
			expect(payload).toBeNull();
		});

		it("should return null for structurally invalid response tokens", () => {
			expect(parseResponseToken("invalid-token")).toBeNull();
			const badPayload = btoa(JSON.stringify({ v: 1, n: "Harry" /* missing 'b' and 'e' */ }));
			expect(parseResponseToken(badPayload)).toBeNull();
		});
	});
});
