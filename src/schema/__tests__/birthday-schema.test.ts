import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { birthdaySchema } from "../birthday-schema";

describe("birthdaySchema validation", () => {
	beforeEach(() => {
		// Mock system time to 2026-08-24
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2026, 7, 24)); // Month is 0-indexed (7 = August)
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should accept valid dates on or before today", () => {
		const result1 = birthdaySchema.safeParse({
			name: "John Doe",
			birthday: "1990-05-15",
			relationship: "Friend",
			notes: [],
			giftIdeas: [],
		});
		expect(result1.success).toBe(true);

		const result2 = birthdaySchema.safeParse({
			name: "Jane Doe",
			birthday: "2026-08-24", // Exact boundary
			relationship: "Friend",
			notes: [],
			giftIdeas: [],
		});
		expect(result2.success).toBe(true);
	});

	it("should reject future dates", () => {
		const result = birthdaySchema.safeParse({
			name: "John Doe",
			birthday: "2026-08-25", // Next day
			relationship: "Friend",
			notes: [],
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Birthday cannot be in the future.");
		}
	});

	it("should reject years before 1900", () => {
		const result = birthdaySchema.safeParse({
			name: "John Doe",
			birthday: "1899-12-31",
			relationship: "Friend",
			notes: [],
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Year must be 1900 or later.");
		}
	});

	it("should reject years less than 100 (e.g. 0099)", () => {
		const result = birthdaySchema.safeParse({
			name: "John Doe",
			birthday: "0099-12-31",
			relationship: "Friend",
			notes: [],
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Year must be 1900 or later.");
		}
	});

	it("should reject invalid rollover dates (e.g. Feb 30)", () => {
		const result = birthdaySchema.safeParse({
			name: "John Doe",
			birthday: "2025-02-30",
			relationship: "Friend",
			notes: [],
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Invalid date.");
		}
	});

	it("should reject invalid month (e.g. 13)", () => {
		const result = birthdaySchema.safeParse({
			name: "John Doe",
			birthday: "2025-13-01",
			relationship: "Friend",
			notes: [],
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Invalid date.");
		}
	});

	it("should validate giftIdeas limits", () => {
		const result = birthdaySchema.safeParse({
			name: "John Doe",
			birthday: "1990-05-15",
			relationship: "Friend",
			notes: [],
			giftIdeas: Array(11).fill("Gift"), // exceeds GIFT_IDEA_MAX_COUNT (10)
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("You can only add up to 10 gift ideas.");
		}
	});
});
