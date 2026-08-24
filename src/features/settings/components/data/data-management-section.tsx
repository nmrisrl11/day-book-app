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
const P2PSyncSection = lazy(() =>
	import("./p2p-sync-section").then((m) => ({ default: m.P2PSyncSection })),
);
const StorageInfo = lazy(() => import("./storage-info").then((m) => ({ default: m.StorageInfo })));

import { Skeleton } from "@/components/ui/skeleton";

export function DataManagementSection() {
	return (
		<div className="flex flex-col gap-6">
			<Suspense
				fallback={
					<div className="flex flex-col gap-6">
						<Skeleton className="h-32 w-full rounded-xl" />
						<Skeleton className="h-32 w-full rounded-xl" />
						<Skeleton className="h-32 w-full rounded-xl" />
						<Skeleton className="h-24 w-full rounded-xl" />
					</div>
				}
			>
				<StorageInfo />
				<P2PSyncSection />
				<BirthdaysDataManagement />
				<SettingsDataManagement />
				<GlobalSettingsManagement />
			</Suspense>
		</div>
	);
}
