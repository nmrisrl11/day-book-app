import { useBirthdayData } from "@/hooks/use-birthday-data";
import { Suspense, useState } from "react";
import { BackupReminderBanner } from "./components/backup-reminder-banner";
import { DashboardEmptyState } from "./components/dashboard-empty-state";
import { DashboardRouteFallback } from "./components/dashboard-route-fallback";
import { InstallAppBanner } from "./components/install-app-banner";

import { SEO } from "@/components/seo/seo";
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

	const [previewMode, setPreviewMode] = useState(false);
	const [isInstallBannerVisible, setIsInstallBannerVisible] = useState(false);

	if (isLoading) {
		return <DashboardRouteFallback />;
	}
	if (birthdays.length === 0) {
		return (
			<>
				<SEO canonical="/" />
				<DashboardEmptyState />
			</>
		);
	}

	const activeCelebrants = previewMode && birthdays.length > 0 ? [birthdays[0]] : todayCelebrants;

	return (
		<>
			<SEO canonical="/" />
			<div className="flex w-full flex-col items-center gap-16">
				<h1 className="sr-only">Dashboard</h1>
				<Suspense fallback={<DashboardRouteFallback />}>
					<HappyBirthdaySection
						celebrants={activeCelebrants}
						currentDate={currentDate}
						isPreviewMode={previewMode}
						onClosePreview={() => setPreviewMode(false)}
						onStartPreview={() => setPreviewMode(true)}
						hasDataToPreview={birthdays.length > 0}
					/>
					<UpcomingBirthdaysSection
						upcomingBirthdays={upcomingBirthdays}
						currentDate={currentDate}
					/>
					<BirthdaysSection birthdaysByMonth={birthdaysByMonth} currentDate={currentDate} />
					<InstallAppBanner
						birthdaysCount={birthdays.length}
						onVisibilityChange={setIsInstallBannerVisible}
					/>
					{!isInstallBannerVisible && <BackupReminderBanner birthdaysCount={birthdays.length} />}
				</Suspense>
				<QuickActionToolbar hasCelebrants={activeCelebrants.length > 0} />
			</div>
		</>
	);
}
