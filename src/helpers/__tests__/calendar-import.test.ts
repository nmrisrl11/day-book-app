import { describe, it, expect } from "vitest";
import { parseIcsForBirthdays } from "../calendar-import";

describe("calendar-import", () => {
	it("should parse standard birthday ICS events and clean emojis/suffixes", () => {
		const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Apple Inc.//Mac OS X 10.15.7//EN
BEGIN:VEVENT
SUMMARY:🎂🎉 John's Birthday
DTSTART;VALUE=DATE:19900515
RRULE:FREQ=YEARLY
END:VEVENT
END:VCALENDAR`;

		const result = parseIcsForBirthdays(icsData);
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("John");
		expect(result[0].birthday).toBe("1990-05-15");
		expect(result[0].relationship).toBe("Other"); // Default
	});

	it("should parse DayBook specific ICS events with relationships and notes", () => {
		const icsData = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Alice
DTSTART;VALUE=DATE:19851020
RRULE:FREQ=YEARLY
DESCRIPTION:Relationship: Family\\n
X-DAYBOOK-NOTE:Loves chocolate
X-DAYBOOK-NOTE:Allergic to peanuts
END:VEVENT
END:VCALENDAR`;

		const result = parseIcsForBirthdays(icsData);
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Alice");
		expect(result[0].birthday).toBe("1985-10-20");
		expect(result[0].relationship).toBe("Family");
		expect(result[0].notes).toEqual(["Loves chocolate", "Allergic to peanuts"]);
	});

	it("should handle non-yearly events if the summary includes 'birthday'", () => {
		const icsData = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Bob Birthday Party
DTSTART:20240510T120000Z
END:VEVENT
END:VCALENDAR`;

		const result = parseIcsForBirthdays(icsData);
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Bob Party"); // ' Birthday ' gets removed
		expect(result[0].birthday).toBe("2024-05-10");
	});

	it("should ignore events without valid dates", () => {
		const icsData = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Invalid Date Birthday
DTSTART:invalid
RRULE:FREQ=YEARLY
END:VEVENT
END:VCALENDAR`;

		const result = parseIcsForBirthdays(icsData);
		expect(result).toHaveLength(0);
	});

	it("should ignore non-yearly events that don't mention birthday", () => {
		const icsData = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Dentist Appointment
DTSTART:20240510T120000Z
END:VEVENT
END:VCALENDAR`;

		const result = parseIcsForBirthdays(icsData);
		expect(result).toHaveLength(0);
	});

	it("should unescape escaped characters in ICS text", () => {
		const icsData = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Test\\, Name\\;
DTSTART;VALUE=DATE:20000101
RRULE:FREQ=YEARLY
DESCRIPTION:Line 1\\nLine 2
END:VEVENT
END:VCALENDAR`;

		const result = parseIcsForBirthdays(icsData);
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Test, Name;");
	});
});
