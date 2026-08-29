import type { Birthday } from "@/types/birthday";
import type { EventInput } from "@fullcalendar/react";

export type BirthdayEventInput = EventInput & {
	extendedProps: {
		celebrants: Birthday[];
	};
};

/**
 * Transforms Birthday records into FullCalendar EventInputs for the visible date range.
 * This groups multiple birthdays on the same date into a single EventInput to keep the UI clean.
 */
export function generateBirthdayEvents(
	birthdays: Birthday[],
	viewStart: Date,
	viewEnd: Date,
): BirthdayEventInput[] {
	const events: BirthdayEventInput[] = [];

	const startYear = viewStart.getFullYear();
	const endYear = viewEnd.getFullYear();

	// Map to group birthdays by Date String (YYYY-MM-DD)
	const eventsByDate = new Map<string, Birthday[]>();

	for (const person of birthdays) {
		const [_, monthStr, dayStr] = person.birthday.split("-");

		for (let year = startYear; year <= endYear; year++) {
			let eventDay = dayStr;

			if (monthStr === "02" && dayStr === "29") {
				const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
				if (!isLeapYear) {
					eventDay = "28"; // Display Feb 29 birthdays on Feb 28 in non-leap years
				}
			}

			const eventDateStr = `${year}-${monthStr}-${eventDay}`;

			if (!eventsByDate.has(eventDateStr)) {
				eventsByDate.set(eventDateStr, []);
			}
			eventsByDate.get(eventDateStr)!.push(person);
		}
	}

	for (const [dateStr, celebrants] of eventsByDate.entries()) {
		const title = `Birthdays: ${celebrants.map((c) => c.name).join(", ")}`;
		events.push({
			id: dateStr,
			title,
			date: dateStr,
			allDay: true,
			extendedProps: {
				celebrants,
			},
		});
	}

	return events;
}
