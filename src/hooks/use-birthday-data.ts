import { useMemo } from "react";
import {
	getUpcomingBirthdays,
	getTodayCelebrants,
	getBirthdaysByMonth,
} from "@/helpers/birthday-utils";
import { useDayBook } from "@/context/day-book-context";

export function useBirthdayData() {
	const { birthdays, settings } = useDayBook();

	return useMemo(() => {
		const now = new Date();
		const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		const todayCelebrants = getTodayCelebrants(birthdays, currentDate);

		const allUpcoming = getUpcomingBirthdays(birthdays, currentDate);
		const upcomingBirthdays = allUpcoming
			.filter((b) => !todayCelebrants.some((today) => today.id === b.id))
			.slice(0, settings.upcomingCount);

		const birthdaysByMonth = getBirthdaysByMonth(birthdays);

		return {
			todayCelebrants,
			upcomingBirthdays,
			birthdaysByMonth,
			currentDate,
		};
	}, [birthdays, settings.upcomingCount]);
}
