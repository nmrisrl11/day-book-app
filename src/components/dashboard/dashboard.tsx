import { BirthdaysSection } from "@/components/birthdays-by-month/birthdays-section";
import { HappyBirthdaySection } from "@/components/happy-birthday/happy-birthday-section";
import { UpcomingBirthdaysSection } from "@/components/upcoming-birthdays/upcoming-birthdays-section";
import { useBirthdayData } from "@/hooks/use-birthday-data";
import { useDayBook } from "@/context/day-book-context";
import { EmptyState } from "@/components/empty-state";

export function Dashboard() {
	const { todayCelebrants, upcomingBirthdays, birthdaysByMonth, currentDate } = useBirthdayData();
	const { birthdays } = useDayBook();

	if (birthdays.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="flex w-full flex-col items-center gap-16">
			<HappyBirthdaySection celebrants={todayCelebrants} currentDate={currentDate} />
			<UpcomingBirthdaysSection upcomingBirthdays={upcomingBirthdays} currentDate={currentDate} />
			<BirthdaysSection birthdaysByMonth={birthdaysByMonth} />
		</div>
	);
}
