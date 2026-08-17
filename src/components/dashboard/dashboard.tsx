import { EmptyState } from "@/components/empty-state";
import { useBirthdayData } from "@/hooks/use-birthday-data";
import { useDayBookStore } from "@/store/day-book-store";
import { lazy, Suspense } from "react";

const BirthdaysSection = lazy(() =>
	import("@/components/birthdays-by-month/birthdays-section").then((m) => ({
		default: m.BirthdaysSection,
	})),
);
const HappyBirthdaySection = lazy(() =>
	import("@/components/happy-birthday/happy-birthday-section").then((m) => ({
		default: m.HappyBirthdaySection,
	})),
);
const UpcomingBirthdaysSection = lazy(() =>
	import("@/components/upcoming-birthdays/upcoming-birthdays-section").then((m) => ({
		default: m.UpcomingBirthdaysSection,
	})),
);

export function Dashboard() {
	const { todayCelebrants, upcomingBirthdays, birthdaysByMonth, currentDate } = useBirthdayData();
	const { birthdays } = useDayBookStore();

	if (birthdays.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="flex w-full flex-col items-center gap-16">
			<Suspense
				fallback={
					<div className="flex min-h-[20vh] w-full items-center justify-center">
						<div className="text-muted-foreground animate-pulse text-sm">Loading...</div>
					</div>
				}
			>
				<HappyBirthdaySection celebrants={todayCelebrants} currentDate={currentDate} />
				<UpcomingBirthdaysSection upcomingBirthdays={upcomingBirthdays} currentDate={currentDate} />
				<BirthdaysSection birthdaysByMonth={birthdaysByMonth} />
			</Suspense>
		</div>
	);
}
