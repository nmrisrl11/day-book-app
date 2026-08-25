import { Button } from "@/components/ui/button";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { lazy, Suspense, useState } from "react";

const ActionConfirmationModal = lazy(() =>
	import("@/components/action-confirmation-modal").then((m) => ({
		default: m.ActionConfirmationModal,
	})),
);

export function GlobalSettingsManagement() {
	const { updateSettings } = useDayBookStore();
	const [resetModalOpen, setResetModalOpen] = useState(false);

	const handleResetAllSettingsClick = () => {
		setResetModalOpen(true);
	};

	const handleConfirmResetAll = () => {
		updateSettings(defaultSettings);
		setResetModalOpen(false);
	};

	return (
		<>
			<div className="flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1 pr-4">
					<h4 className="text-sm font-semibold">Reset Configurations</h4>
					<p className="text-muted-foreground text-sm">
						Permanently reset all your configurations to their defaults.
					</p>
				</div>
				<div className="mt-2 flex w-full shrink-0 items-center gap-2 sm:mt-0 sm:w-auto">
					<Button
						variant="destructive"
						size="sm"
						onClick={handleResetAllSettingsClick}
						aria-label="Reset all settings to defaults"
						className="w-full sm:w-auto"
					>
						Reset All Settings
					</Button>
				</div>
			</div>

			{resetModalOpen && (
				<Suspense fallback={null}>
					<ActionConfirmationModal
						open={resetModalOpen}
						onOpenChange={setResetModalOpen}
						title="Reset All Settings"
						description={
							<p>
								Are you sure you want to reset{" "}
								<span className="text-foreground font-semibold">ALL</span> settings to their
								defaults? This includes your theme, sound preferences, custom greetings, and display
								options. This action cannot be undone.
							</p>
						}
						footer={
							<>
								<Button
									id="cancel-reset-btn"
									variant="ghost"
									onClick={() => setResetModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={handleConfirmResetAll}
									aria-label="Reset Settings"
								>
									Reset Settings
								</Button>
							</>
						}
					/>
				</Suspense>
			)}
		</>
	);
}
