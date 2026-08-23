import {
	getBirthdaysByMonth,
	getTodayCelebrants,
	getUpcomingBirthdays,
} from "@/helpers/birthday-utils";
import { useDayBookStore } from "@/store/day-book-store";
import { useEffect, useMemo } from "react";

import { BirthdayRepository } from "@/lib/birthday-repository";
import { useLiveQuery } from "dexie-react-hooks";

export function useBirthdayData() {
	const settings = useDayBookStore((state) => state.settings);
	const birthdaysData = useLiveQuery(() => BirthdayRepository.getAll(), []);
	const isLoading = birthdaysData === undefined;
	const birthdays = birthdaysData ?? [];

	useEffect(() => {
		if (!isLoading) {
			localStorage.setItem("daybook_has_data", birthdays.length > 0 ? "true" : "false");
		}
	}, [isLoading, birthdays.length]);

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
			isLoading,
			birthdays,
		};
	}, [birthdays, isLoading, settings.upcomingCount]);
}
