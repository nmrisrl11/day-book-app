import { APP_INFO } from "@/constants/app-info";
import type { Birthday } from "@/types/birthday";
import { describe, expect, it } from "vitest";
import { generateGoogleCalendarUrl, generateIcsContent } from "../calendar-export";

describe("calendar-export", () => {
	const sampleBirthday: Birthday = {
		id: "123-abc",
		name: "John Doe",
		birthday: "1990-05-15",
		relationship: "Friend",
		notes: ["Loves coffee", "Allergic to nuts"],
	};

	describe("generateGoogleCalendarUrl", () => {
		it("should generate a valid Google Calendar URL", () => {
			const url = generateGoogleCalendarUrl(sampleBirthday);

			expect(url).toContain("https://calendar.google.com/calendar/render?");
			expect(url).toContain("action=TEMPLATE");

			// Check params using URL object
			const urlObj = new URL(url);
			expect(urlObj.searchParams.get("text")).toBe("John Doe's Birthday 🎂");
			expect(urlObj.searchParams.get("dates")).toBe("19900515/19900516"); // start/end dates
			expect(urlObj.searchParams.get("recur")).toBe("RRULE:FREQ=YEARLY");

			const details = urlObj.searchParams.get("details");
			expect(details).toContain("Relationship: Friend");
			expect(details).toContain("Notes: Loves coffee • Allergic to nuts");
			expect(details).toContain(`Imported from ${APP_INFO.name}`);
		});

		it("should handle birthdays without notes gracefully", () => {
			const bdayWithoutNotes = { ...sampleBirthday, notes: [] };
			const url = generateGoogleCalendarUrl(bdayWithoutNotes);
			const urlObj = new URL(url);
			expect(urlObj.searchParams.get("details")).not.toContain("Notes:");
			expect(urlObj.searchParams.get("details")).toContain("Relationship: Friend");
		});

		it("should handle missing relationship gracefully", () => {
			const bdayNoRel = { ...sampleBirthday, relationship: undefined as any };
			const url = generateGoogleCalendarUrl(bdayNoRel);
			const urlObj = new URL(url);
			expect(urlObj.searchParams.get("details")).toContain("Relationship: Other");
		});
	});

	describe("generateIcsContent", () => {
		it("should generate valid ICS content for a single birthday", () => {
			const ics = generateIcsContent(sampleBirthday);

			expect(ics).toContain("BEGIN:VCALENDAR");
			expect(ics).toContain("VERSION:2.0");
			expect(ics).toContain(`PRODID:-//${APP_INFO.name}//Birthday Calendar//EN`);
			expect(ics).toContain("BEGIN:VEVENT");
			expect(ics).toContain("UID:daybook-123-abc@daybook.app");
			expect(ics).toContain("DTSTART;VALUE=DATE:19900515");
			expect(ics).toContain("DTEND;VALUE=DATE:19900516");
			expect(ics).toContain("SUMMARY:John Doe's Birthday");
			expect(ics).toContain(
				`DESCRIPTION:Relationship: Friend\\nNotes: Loves coffee • Allergic to nuts\\n\\nImported from ${APP_INFO.name}.`,
			);
			expect(ics).toContain("X-DAYBOOK-NOTE:Loves coffee");
			expect(ics).toContain("X-DAYBOOK-NOTE:Allergic to nuts");
			expect(ics).toContain("RRULE:FREQ=YEARLY");
			expect(ics).toContain("END:VEVENT");
			expect(ics).toContain("END:VCALENDAR");
			expect(ics).toMatch(/\r\n/); // Check for CRLF endings
		});

		it("should escape special characters in ICS", () => {
			const trickyBday: Birthday = {
				id: "456",
				name: "Jane, Doe; The\\Great",
				birthday: "1995-10-10",
				relationship: "Family",
				notes: ["Note 1\\;", "Note 2,"],
			};
			const ics = generateIcsContent(trickyBday);

			expect(ics).toContain("SUMMARY:Jane\\, Doe\\; The\\\\Great's Birthday");
			expect(ics).toContain("X-DAYBOOK-NOTE:Note 1\\\\\\;");
			expect(ics).toContain("X-DAYBOOK-NOTE:Note 2\\,");
		});

		it("should generate ICS for an array of birthdays", () => {
			const ics = generateIcsContent([
				sampleBirthday,
				{ ...sampleBirthday, id: "456", name: "Alice" },
			]);

			// Should contain two VEVENTS
			const eventMatches = ics.match(/BEGIN:VEVENT/g);
			expect(eventMatches).toHaveLength(2);

			expect(ics).toContain("UID:daybook-123-abc@daybook.app");
			expect(ics).toContain("UID:daybook-456@daybook.app");
			expect(ics).toContain("SUMMARY:Alice's Birthday");
		});
	});
});
