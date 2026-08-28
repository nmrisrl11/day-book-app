import type { Birthday } from "@/types/birthday";

export interface CalendarEventInput {
	id: string;
	date: string;
	allDay: boolean;
	extendedProps: {
		celebrants: Birthday[];
	};
}

/**
 * Transforms Birthday records into FullCalendar EventInputs for the visible date range.
 * This groups multiple birthdays on the same date into a single EventInput to keep the UI clean.
 */
export function generateBirthdayEvents(
	birthdays: Birthday[],
	viewStart: Date,
	viewEnd: Date,
): CalendarEventInput[] {
	const events: CalendarEventInput[] = [];

	const startYear = viewStart.getFullYear();
	const endYear = viewEnd.getFullYear();

	// Map to group birthdays by Date String (YYYY-MM-DD)
	const eventsByDate = new Map<string, Birthday[]>();

	for (const person of birthdays) {
		const [_, monthStr, dayStr] = person.birthday.split("-");

		for (let year = startYear; year <= endYear; year++) {
			const eventDateStr = `${year}-${monthStr}-${dayStr}`;

			if (!eventsByDate.has(eventDateStr)) {
				eventsByDate.set(eventDateStr, []);
			}
			eventsByDate.get(eventDateStr)!.push(person);
		}
	}

	for (const [dateStr, celebrants] of eventsByDate.entries()) {
		events.push({
			id: dateStr,
			date: dateStr,
			allDay: true,
			extendedProps: {
				celebrants,
			},
		});
	}

	return events;
}
