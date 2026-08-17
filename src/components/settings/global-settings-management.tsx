import { Button } from "@/components/ui/button";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { lazy, Suspense, useState } from "react";

const ResetSettingsModal = lazy(() =>
	import("./reset-settings-modal").then((m) => ({ default: m.ResetSettingsModal })),
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
			<div className="border-destructive/20 bg-destructive/5 flex flex-col gap-3 rounded-xl border p-3">
				<div className="flex flex-col gap-1.5">
					<h3 className="text-destructive text-base font-bold">Global Settings</h3>
					<p className="text-muted-foreground text-sm">
						Permanently reset all your configurations to their defaults.
					</p>
				</div>
				<Button
					variant="destructive"
					onClick={handleResetAllSettingsClick}
					aria-label="Reset all settings to defaults"
				>
					Reset All Settings to Defaults
				</Button>
			</div>

			{resetModalOpen && (
				<Suspense fallback={null}>
					<ResetSettingsModal
						open={resetModalOpen}
						onOpenChange={setResetModalOpen}
						onConfirm={handleConfirmResetAll}
					/>
				</Suspense>
			)}
		</>
	);
}
