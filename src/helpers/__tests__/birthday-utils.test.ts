import { describe, it, expect } from "vitest";
import {
	parseBirthday,
	getUpcomingBirthdays,
	getTodayCelebrants,
	getBirthdaysByMonth,
	formatBirthdayDisplay,
	formatAgeDisplay,
	calculateAge,
	calculateDaysUntilBirthday,
} from "../birthday-utils";
import type { Birthday } from "@/types/birthday";

describe("birthday-utils", () => {
	// Use local time noon so we avoid UTC-to-local timezone shifting across tests
	const mockDate = new Date(2024, 4, 15, 12, 0, 0);

	const sampleBirthdays: Birthday[] = [
		{ id: "1", name: "Alice", birthday: "1990-05-15", relationship: "Friend", notes: [] }, // Today
		{ id: "2", name: "Bob", birthday: "1985-05-16", relationship: "Family", notes: [] }, // Tomorrow
		{ id: "3", name: "Charlie", birthday: "2000-12-31", relationship: "Me", notes: [] }, // End of year
		{ id: "4", name: "Dave", birthday: "1980-01-01", relationship: "Other", notes: [] }, // Passed this year
		{ id: "5", name: "Eve", birthday: "0000-06-15", relationship: "Other", notes: [] }, // No year specified
	];

	describe("parseBirthday", () => {
		it("should correctly parse a YYYY-MM-DD string into a Date object", () => {
			const date = parseBirthday("1990-05-15");
			expect(date.getFullYear()).toBe(1990);
			expect(date.getMonth()).toBe(4); // 0-indexed
			expect(date.getDate()).toBe(15);
		});
	});

	describe("getUpcomingBirthdays", () => {
		it("should return birthdays sorted by next occurrence", () => {
			const upcoming = getUpcomingBirthdays(sampleBirthdays, mockDate);
			// Expected order relative to May 15: Alice (Today), Bob (May 16), Eve (June 15), Charlie (Dec 31), Dave (Jan 1 next year)
			expect(upcoming[0].name).toBe("Alice");
			expect(upcoming[1].name).toBe("Bob");
			expect(upcoming[2].name).toBe("Eve");
			expect(upcoming[3].name).toBe("Charlie");
			expect(upcoming[4].name).toBe("Dave");
		});
	});

	describe("getTodayCelebrants", () => {
		it("should return only birthdays that match the current month and day", () => {
			const celebrants = getTodayCelebrants(sampleBirthdays, mockDate);
			expect(celebrants).toHaveLength(1);
			expect(celebrants[0].name).toBe("Alice");
		});
	});

	describe("getBirthdaysByMonth", () => {
		it("should group birthdays by month and sort them by date within the month", () => {
			const grouped = getBirthdaysByMonth(sampleBirthdays);
			expect(grouped[0]).toHaveLength(1); // Jan (Dave)
			expect(grouped[0][0].name).toBe("Dave");

			expect(grouped[4]).toHaveLength(2); // May (Alice, Bob)
			expect(grouped[4][0].name).toBe("Alice"); // 15th
			expect(grouped[4][1].name).toBe("Bob"); // 16th

			expect(grouped[5]).toHaveLength(1); // June (Eve)
			expect(grouped[11]).toHaveLength(1); // Dec (Charlie)
		});
	});

	describe("formatBirthdayDisplay", () => {
		it("should format date correctly as 'Month Day'", () => {
			expect(formatBirthdayDisplay("1990-05-15")).toBe("May 15");
			expect(formatBirthdayDisplay("0000-01-01")).toBe("January 1");
		});
	});

	describe("formatAgeDisplay", () => {
		it("should return X years old for ages >= 1", () => {
			expect(formatAgeDisplay("1990-05-15", mockDate)).toBe("34 years old");
			expect(formatAgeDisplay("2023-01-01", mockDate)).toBe("1 year old");
		});

		it("should return months old for ages < 1 year but >= 1 month", () => {
			expect(formatAgeDisplay("2024-03-15", mockDate)).toBe("2 months old");
			expect(formatAgeDisplay("2024-04-15", mockDate)).toBe("1 month old");
		});

		it("should return days old for ages < 1 month but >= 1 day", () => {
			expect(formatAgeDisplay("2024-05-10", mockDate)).toBe("5 days old");
			expect(formatAgeDisplay("2024-05-14", mockDate)).toBe("1 day old");
		});

		it("should return Newborn for birthdays today (0 days old)", () => {
			expect(formatAgeDisplay("2024-05-15", mockDate)).toBe("Newborn");
		});

		it("should return null if the year is 0000", () => {
			expect(formatAgeDisplay("0000-05-15", mockDate)).toBeNull();
		});
	});

	describe("calculateAge", () => {
		it("should calculate correct age if birthday has occurred this year", () => {
			expect(calculateAge("1990-01-01", mockDate)).toBe(34);
		});

		it("should calculate correct age if birthday is today", () => {
			expect(calculateAge("1990-05-15", mockDate)).toBe(34);
		});

		it("should calculate correct age if birthday has not yet occurred this year", () => {
			expect(calculateAge("1990-12-31", mockDate)).toBe(33);
		});

		it("should return null if the year is 0000", () => {
			expect(calculateAge("0000-05-15", mockDate)).toBeNull();
		});
	});

	describe("calculateDaysUntilBirthday", () => {
		it("should return 0 for today", () => {
			expect(calculateDaysUntilBirthday("1990-05-15", mockDate)).toBe(0);
		});

		it("should return 1 for tomorrow", () => {
			expect(calculateDaysUntilBirthday("1990-05-16", mockDate)).toBe(1);
		});

		it("should return days until next year if birthday already passed", () => {
			// Jan 1st passed, next occurrence is Jan 1st 2025. 2024 is a leap year (366 days).
			// May 15 2024 to Jan 1 2025
			const days = calculateDaysUntilBirthday("1990-01-01", mockDate);
			expect(days).toBeGreaterThan(200); // Rough check
		});
	});
});
