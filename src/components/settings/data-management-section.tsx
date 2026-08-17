import { lazy, Suspense } from "react";

const BirthdaysDataManagement = lazy(() =>
	import("./birthdays-data-management").then((m) => ({ default: m.BirthdaysDataManagement })),
);
const SettingsDataManagement = lazy(() =>
	import("./settings-data-management").then((m) => ({ default: m.SettingsDataManagement })),
);
const GlobalSettingsManagement = lazy(() =>
	import("./global-settings-management").then((m) => ({ default: m.GlobalSettingsManagement })),
);

export function DataManagementSection() {
	return (
		<div className="flex flex-col gap-6">
			<Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-xl"></div>}>
				<BirthdaysDataManagement />
				<SettingsDataManagement />
				<div className="my-2 border-t" />
				<GlobalSettingsManagement />
			</Suspense>
		</div>
	);
}
