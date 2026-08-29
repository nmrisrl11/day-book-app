import { describe, expect, it } from "vitest";
import { parseImportedBirthdays } from "../import-export";

describe("parseImportedBirthdays", () => {
	it("should parse a valid birthday successfully", () => {
		const validData = JSON.stringify([
			{
				id: "123",
				name: "John Doe",
				birthday: "1990-01-01",
				relationship: "Friend",
				notes: ["Cool guy"],
			},
		]);
		const result = parseImportedBirthdays(validData, new Date("2026-08-29"));
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("John Doe");
	});

	it("should normalize a non-string avatar to undefined without rejecting the record", () => {
		const dataWithNonStringAvatar = JSON.stringify([
			{
				id: "456",
				name: "Jane Doe",
				birthday: "1995-05-05",
				avatar: { url: "invalid" }, // Non-string
				relationship: "Family",
			},
		]);
		const result = parseImportedBirthdays(dataWithNonStringAvatar, new Date("2026-08-29"));
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Jane Doe");
		expect(result[0].avatar).toBeUndefined();
	});

	it("should normalize an empty string avatar to undefined without rejecting the record", () => {
		const dataWithEmptyAvatar = JSON.stringify([
			{
				id: "789",
				name: "Alice",
				birthday: "1988-08-08",
				avatar: "", // Empty string
				relationship: "Other",
			},
		]);
		const result = parseImportedBirthdays(dataWithEmptyAvatar, new Date("2026-08-29"));
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Alice");
		expect(result[0].avatar).toBeUndefined();
	});
});
