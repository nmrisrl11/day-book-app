import type { Birthday } from "@/types/birthday";

/**
 * Format a Date object or YYYY-MM-DD string to YYYYMMDD for calendar formats
 */
function formatDateToYYYYMMDD(dateString: string): string {
	return dateString.replace(/-/g, "");
}

/**
 * Add 1 day to a YYYY-MM-DD date string and format to YYYYMMDD.
 * Needed for all-day events where DTEND is exclusive.
 */
function getNextDayYYYYMMDD(dateString: string): string {
	const date = new Date(dateString);
	date.setDate(date.getDate() + 1);
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}${mm}${dd}`;
}

/**
 * Get current UTC date/time in YYYYMMDDThhmmssZ format for DTSTAMP
 */
function getCurrentDTSTAMP(): string {
	const now = new Date();
	return now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Generates a Google Calendar 'add event' URL for a single birthday.
 */
export function generateGoogleCalendarUrl(birthday: Birthday): string {
	const title = `${birthday.name}'s Birthday 🎂`;
	const description = `Imported from DayBook. Wish ${birthday.name} a happy birthday!`;

	const start = formatDateToYYYYMMDD(birthday.birthday);
	const end = getNextDayYYYYMMDD(birthday.birthday);

	const params = new URLSearchParams({
		action: "TEMPLATE",
		text: title,
		details: description,
		dates: `${start}/${end}`,
		recur: "RRULE:FREQ=YEARLY",
	});

	return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates the raw string content for an .ics file containing one or more birthdays.
 */
export function generateIcsContent(birthdays: Birthday | Birthday[]): string {
	const bdays = Array.isArray(birthdays) ? birthdays : [birthdays];
	const dtStamp = getCurrentDTSTAMP();

	let ics = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//DayBook//Birthday Calendar//EN",
		"CALSCALE:GREGORIAN",
	];

	for (const birthday of bdays) {
		const start = formatDateToYYYYMMDD(birthday.birthday);
		const end = getNextDayYYYYMMDD(birthday.birthday);
		const uid = `daybook-${birthday.id}@daybook.app`;
		const summary = `${birthday.name}'s Birthday`;
		const description = `Imported from DayBook`;

		ics = ics.concat([
			"BEGIN:VEVENT",
			`UID:${uid}`,
			`DTSTAMP:${dtStamp}`,
			`DTSTART;VALUE=DATE:${start}`,
			`DTEND;VALUE=DATE:${end}`,
			`SUMMARY:${summary}`,
			`DESCRIPTION:${description}`,
			"RRULE:FREQ=YEARLY",
			"TRANSP:TRANSPARENT", // Shows as 'free' not 'busy'
			"END:VEVENT",
		]);
	}

	ics.push("END:VCALENDAR");

	// ICS lines should end with CRLF
	return ics.join("\r\n");
}

/**
 * Triggers a download of an .ics file in the browser.
 */
export function downloadIcsFile(content: string, filename: string) {
	const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
