import { Button } from "@/components/ui/button";
import { useDayBookStore } from "@/store/day-book-store";
import { exportBirthdays } from "@/helpers/import-export";
import { ArrowLeft } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingMessagesManager = lazy(() =>
	import("./floating-messages-manager").then((m) => ({ default: m.FloatingMessagesManager })),
);
const GreetingsManager = lazy(() =>
	import("./greetings-manager").then((m) => ({ default: m.GreetingsManager })),
);
const DeleteConfirmationModal = lazy(() =>
	import("../management/delete-confirmation-modal").then((m) => ({
		default: m.DeleteConfirmationModal,
	})),
);
const ThemeSection = lazy(() =>
	import("./theme-section").then((m) => ({ default: m.ThemeSection })),
);
const DisplaySettingsSection = lazy(() =>
	import("./display-settings-section").then((m) => ({ default: m.DisplaySettingsSection })),
);
const AvatarSettingsSection = lazy(() =>
	import("./avatar-settings-section").then((m) => ({ default: m.AvatarSettingsSection })),
);
const DataManagementSection = lazy(() =>
	import("./data-management-section").then((m) => ({ default: m.DataManagementSection })),
);
const DangerZoneSection = lazy(() =>
	import("./danger-zone-section").then((m) => ({ default: m.DangerZoneSection })),
);

export function SettingsScreen() {
	const { birthdays, deleteAllBirthdays } = useDayBookStore();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const navigate = useNavigate();

	const handleConfirmDeleteAll = () => {
		deleteAllBirthdays();
		setDeleteModalOpen(false);
	};

	const handleExport = () => {
		exportBirthdays(birthdays);
	};

	return (
		<div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-2xl flex-col gap-6 pb-12 duration-500">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate(-1)}
					className="shrink-0"
					aria-label="Go back"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
					<p className="text-muted-foreground">Manage your preferences and data.</p>
				</div>
			</div>

			<div className="border-border bg-card flex flex-col gap-8 rounded-xl border p-6 shadow-sm">
				<Suspense fallback={<div className="bg-muted h-20 animate-pulse rounded-xl"></div>}>
					<ThemeSection />
					<AvatarSettingsSection />
					<DisplaySettingsSection />
				</Suspense>

				{birthdays.length > 0 && (
					<Suspense fallback={<div className="bg-muted h-20 animate-pulse rounded-xl"></div>}>
						<FloatingMessagesManager />
						<GreetingsManager />
					</Suspense>
				)}

				<Suspense fallback={<div className="bg-muted h-20 animate-pulse rounded-xl"></div>}>
					<DataManagementSection />
				</Suspense>

				{birthdays.length > 0 && (
					<Suspense fallback={<div className="bg-muted h-20 animate-pulse rounded-xl"></div>}>
						<DangerZoneSection onDeleteAllClick={() => setDeleteModalOpen(true)} />
					</Suspense>
				)}
			</div>

			{deleteModalOpen && (
				<Suspense fallback={null}>
					<DeleteConfirmationModal
						open={deleteModalOpen}
						onOpenChange={setDeleteModalOpen}
						onConfirm={handleConfirmDeleteAll}
						isDeleteAll={true}
						onExport={handleExport}
					/>
				</Suspense>
			)}
		</div>
	);
}
