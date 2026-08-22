import { DashboardSkeleton } from "./components/dashboard-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useBirthdayData } from "@/hooks/use-birthday-data";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Suspense } from "react";

import { BirthdaysSection } from "./components/calendar/birthdays-section";
import { HappyBirthdaySection } from "./components/today/happy-birthday-section";
import { UpcomingBirthdaysSection } from "./components/upcoming/upcoming-birthdays-section";

export function Dashboard() {
	const { todayCelebrants, upcomingBirthdays, birthdaysByMonth, currentDate } = useBirthdayData();
	const birthdays = useLiveQuery(() => db.birthdays.toArray(), []) ?? [];

	if (birthdays.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="flex w-full flex-col items-center gap-16">
			<Suspense fallback={<DashboardSkeleton />}>
				<HappyBirthdaySection celebrants={todayCelebrants} currentDate={currentDate} />
				<UpcomingBirthdaysSection upcomingBirthdays={upcomingBirthdays} currentDate={currentDate} />
				<BirthdaysSection birthdaysByMonth={birthdaysByMonth} />
			</Suspense>
		</div>
	);
}
