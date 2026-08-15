import {
	getBirthdaysByMonth,
	getTodayCelebrants,
	getUpcomingBirthdays,
} from "@/helpers/birthday-utils";
import { useDayBookStore } from "@/store/day-book-store";
import { useMemo } from "react";

export function useBirthdayData() {
	const { birthdays, settings } = useDayBookStore();

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
