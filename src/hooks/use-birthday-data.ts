import {
	getBirthdaysByMonth,
	getTodayCelebrants,
	getUpcomingBirthdays,
} from "@/helpers/birthday-utils";
import { useCurrentDate } from "@/hooks/use-current-date";
import { useDayBookStore } from "@/store/day-book-store";

import { BirthdayRepository } from "@/lib/birthday-repository";
import { useLiveQuery } from "dexie-react-hooks";

export function useBirthdayData() {
	const settings = useDayBookStore((state) => state.settings);
	const birthdaysData = useLiveQuery(() => BirthdayRepository.getAll(), []);
	const isLoading = birthdaysData === undefined;
	const birthdays = birthdaysData ?? [];

	const currentDate = useCurrentDate();

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
}
