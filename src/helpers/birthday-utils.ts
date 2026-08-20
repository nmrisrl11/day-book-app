import type { Birthday } from "@/types/birthday";
import {
	compareAsc,
	differenceInDays,
	format,
	isBefore,
	isSameDay,
	parse,
	setYear,
} from "date-fns";

export function parseBirthday(dateString: string): Date {
	// Parse YYYY-MM-DD
	return parse(dateString, "yyyy-MM-dd", new Date());
}

export function getUpcomingBirthdays(birthdays: Birthday[], currentDate: Date): Birthday[] {
	const currentYear = currentDate.getFullYear();

	const withNextOccurrence = birthdays.map((b) => {
		const parsed = parseBirthday(b.birthday);
		let nextOccurrence = setYear(parsed, currentYear);

		// If the birthday has already passed this year (and is not today), it's next year
		if (isBefore(nextOccurrence, currentDate) && !isSameDay(nextOccurrence, currentDate)) {
			nextOccurrence = setYear(parsed, currentYear + 1);
		}

		return { ...b, nextOccurrence };
	});

	// Sort by next occurrence
	withNextOccurrence.sort((a, b) => compareAsc(a.nextOccurrence, b.nextOccurrence));

	// Return original birthday objects (without nextOccurrence property)
	return withNextOccurrence.map(({ id, name, birthday, avatar, relationship, notes }) => ({
		id,
		name,
		birthday,
		avatar,
		relationship,
		notes,
	}));
}

export function getTodayCelebrants(birthdays: Birthday[], currentDate: Date): Birthday[] {
	const currentYear = currentDate.getFullYear();
	return birthdays.filter((b) => {
		const parsed = parseBirthday(b.birthday);
		const thisYearOccurrence = setYear(parsed, currentYear);
		return isSameDay(thisYearOccurrence, currentDate);
	});
}

export function getBirthdaysByMonth(birthdays: Birthday[]): Record<number, Birthday[]> {
	const grouped: Record<number, Birthday[]> = {};

	for (let i = 0; i < 12; i++) {
		grouped[i] = [];
	}

	birthdays.forEach((b) => {
		const parsed = parseBirthday(b.birthday);
		const month = parsed.getMonth();
		grouped[month].push(b);
	});

	// Sort birthdays within each month by date
	Object.keys(grouped).forEach((monthStr) => {
		const month = parseInt(monthStr, 10);
		grouped[month].sort((a, b) => {
			const dateA = parseBirthday(a.birthday);
			const dateB = parseBirthday(b.birthday);
			return dateA.getDate() - dateB.getDate();
		});
	});

	return grouped;
}

export function formatBirthdayDisplay(dateString: string): string {
	const parsed = parseBirthday(dateString);
	return format(parsed, "MMMM d");
}

export function calculateAge(dateString: string, currentDate: Date): number | null {
	// If the date string does not have a real year (e.g. 0000), return null
	if (dateString.startsWith("0000")) return null;

	const parsed = parseBirthday(dateString);
	let age = currentDate.getFullYear() - parsed.getFullYear();

	const currentYearOccurrence = setYear(parsed, currentDate.getFullYear());
	if (
		isBefore(currentDate, currentYearOccurrence) &&
		!isSameDay(currentDate, currentYearOccurrence)
	) {
		age--;
	}

	return age;
}

export function calculateDaysUntilBirthday(dateString: string, currentDate: Date): number {
	const parsed = parseBirthday(dateString);
	const currentYear = currentDate.getFullYear();
	let nextOccurrence = setYear(parsed, currentYear);

	if (isBefore(nextOccurrence, currentDate) && !isSameDay(nextOccurrence, currentDate)) {
		nextOccurrence = setYear(parsed, currentYear + 1);
	}

	return differenceInDays(nextOccurrence, currentDate);
}
