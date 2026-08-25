import { lazy, Suspense } from "react";

const BirthdaysDataManagement = lazy(() =>
	import("./birthdays-data-management").then((m) => ({ default: m.BirthdaysDataManagement })),
);
const SettingsDataManagement = lazy(() =>
	import("./settings-data-management").then((m) => ({ default: m.SettingsDataManagement })),
);
const InvitationsDataManagement = lazy(() =>
	import("./invitations-data-management").then((m) => ({ default: m.InvitationsDataManagement })),
);
const GlobalSettingsManagement = lazy(() =>
	import("./global-settings-management").then((m) => ({ default: m.GlobalSettingsManagement })),
);
const DangerZoneSection = lazy(() =>
	import("./danger-zone-section").then((m) => ({ default: m.DangerZoneSection })),
);
const P2PSyncSection = lazy(() =>
	import("./p2p-sync-section").then((m) => ({ default: m.P2PSyncSection })),
);
const StorageInfo = lazy(() => import("./storage-info").then((m) => ({ default: m.StorageInfo })));

import { Skeleton } from "@/components/ui/skeleton";

interface DataManagementSectionProps {
	onDeleteAllClick: () => void;
	onDeleteAllInvitationsClick: () => void;
	birthdaysCount: number;
	invitationsCount: number;
}

export function DataManagementSection({
	onDeleteAllClick,
	onDeleteAllInvitationsClick,
	birthdaysCount,
	invitationsCount,
}: DataManagementSectionProps) {
	return (
		<div className="flex flex-col gap-6">
			<Suspense
				fallback={
					<div className="flex flex-col gap-6">
						<Skeleton className="h-32 w-full rounded-xl" />
						<Skeleton className="h-32 w-full rounded-xl" />
						<Skeleton className="h-32 w-full rounded-xl" />
						<Skeleton className="h-32 w-full rounded-xl" />
						<Skeleton className="h-24 w-full rounded-xl" />
					</div>
				}
			>
				<div className="bg-card flex flex-col rounded-xl border">
					<div className="bg-muted/30 rounded-t-xl border-b p-4">
						<h3 className="text-base font-semibold">Storage & Network</h3>
						<p className="text-muted-foreground text-sm">
							Monitor your browser storage and sync data across devices.
						</p>
					</div>
					<div className="flex flex-col px-4">
						<StorageInfo />
						<P2PSyncSection />
					</div>
				</div>

				<div className="bg-card flex flex-col rounded-xl border">
					<div className="bg-muted/30 rounded-t-xl border-b p-4">
						<h3 className="text-base font-semibold">Manual Backup & Restore</h3>
						<p className="text-muted-foreground text-sm">
							Export your data for safekeeping or import it from another device.
						</p>
					</div>
					<div className="flex flex-col px-4">
						<BirthdaysDataManagement />
						<InvitationsDataManagement />
						<SettingsDataManagement />
					</div>
				</div>

				<div className="bg-card flex flex-col rounded-xl border">
					<div className="bg-muted/30 rounded-t-xl border-b p-4">
						<h3 className="text-destructive text-base font-semibold">Danger Zone</h3>
						<p className="text-muted-foreground text-sm">
							Advanced actions that permanently reset or delete your data.
						</p>
					</div>
					<div className="flex flex-col px-4">
						<GlobalSettingsManagement />
						{(birthdaysCount > 0 || invitationsCount > 0) && (
							<DangerZoneSection
								onDeleteAllClick={onDeleteAllClick}
								onDeleteAllInvitationsClick={onDeleteAllInvitationsClick}
								birthdaysCount={birthdaysCount}
								invitationsCount={invitationsCount}
							/>
						)}
					</div>
				</div>
			</Suspense>
		</div>
	);
}
