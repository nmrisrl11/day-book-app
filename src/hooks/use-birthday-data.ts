import { useMemo } from "react";
import type { Birthday } from "@/types/birthday";
import {
	getUpcomingBirthdays,
	getTodayCelebrants,
	getBirthdaysByMonth,
} from "@/helpers/birthday-utils";

export function useBirthdayData(birthdays: Birthday[]) {
	return useMemo(() => {
		// For a static site, we just use the current date when the component renders.
		// We strip the time portion to avoid timezone edge cases.
		const now = new Date();
		const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		const todayCelebrants = getTodayCelebrants(birthdays, currentDate);

		// For upcoming, we exclude today's celebrants to avoid double display,
		// unless the design wants them in both.
		// Wait, let's keep them if they are today?
		// Usually, if it's today, it's celebrated at the top, but it can still be the "next" one.
		// Let's exclude today's from upcoming.
		const allUpcoming = getUpcomingBirthdays(birthdays, currentDate);
		const upcomingBirthdays = allUpcoming.filter(
			(b) => !todayCelebrants.some((today) => today.id === b.id),
		);

		const birthdaysByMonth = getBirthdaysByMonth(birthdays);

		return {
			todayCelebrants,
			upcomingBirthdays,
			birthdaysByMonth,
			currentDate,
		};
	}, [birthdays]);
}
