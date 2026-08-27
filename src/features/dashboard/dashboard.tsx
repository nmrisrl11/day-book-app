import { useBirthdayData } from "@/hooks/use-birthday-data";
import { Suspense } from "react";
import { DashboardEmptyState } from "./components/dashboard-empty-state";
import { DashboardRouteFallback } from "./components/dashboard-route-fallback";

import { BirthdaysSection } from "./components/calendar/birthdays-section";
import { QuickActionToolbar } from "./components/quick-actions/quick-action-toolbar";
import { HappyBirthdaySection } from "./components/today/happy-birthday-section";
import { UpcomingBirthdaysSection } from "./components/upcoming/upcoming-birthdays-section";

export function Dashboard() {
	const {
		todayCelebrants,
		upcomingBirthdays,
		birthdaysByMonth,
		currentDate,
		isLoading,
		birthdays,
	} = useBirthdayData();

	if (isLoading) {
		return <DashboardRouteFallback />;
	}
	if (birthdays.length === 0) {
		return <DashboardEmptyState />;
	}

	return (
		<div className="flex w-full flex-col items-center gap-16">
			<Suspense fallback={<DashboardRouteFallback />}>
				<HappyBirthdaySection celebrants={todayCelebrants} currentDate={currentDate} />
				<UpcomingBirthdaysSection upcomingBirthdays={upcomingBirthdays} currentDate={currentDate} />
				<BirthdaysSection birthdaysByMonth={birthdaysByMonth} currentDate={currentDate} />
			</Suspense>
			<QuickActionToolbar hasCelebrants={todayCelebrants.length > 0} />
		</div>
	);
}
