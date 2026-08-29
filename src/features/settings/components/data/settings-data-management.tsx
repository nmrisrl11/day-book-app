import { InfoTooltip } from "@/components/info-tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportSettings, parseImportedSettings } from "@/helpers/import-export";
import { useDayBookStore } from "@/store/day-book-store";
import type { Settings } from "@/types/settings";
import { gooeyToast } from "goey-toast";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { lazy, Suspense, useRef, useState } from "react";

const SettingsImportPreviewDialog = lazy(() =>
	import("./settings-import-preview-dialog").then((module) => ({
		default: module.SettingsImportPreviewDialog,
	})),
);

export function SettingsDataManagement() {
	const { settings, updateSettings } = useDayBookStore();
	const fileInputSettingsRef = useRef<HTMLInputElement>(null);
	const [importPreviewOpen, setImportPreviewOpen] = useState(false);
	const [importedSettings, setImportedSettings] = useState<Partial<Settings> | null>(null);

	const handleExportSettings = () => {
		exportSettings(settings);
	};

	const handleImportSettingsClick = () => {
		fileInputSettingsRef.current?.click();
	};

	const handleSettingsFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const parsed = parseImportedSettings(text);
			setImportedSettings(parsed);
			setImportPreviewOpen(true);
		} catch (err) {
			gooeyToast.error("Import Failed", {
				id: "import-error",
				description: err instanceof Error ? err.message : "Failed to import settings.",
				showTimestamp: false,
			});
		} finally {
			if (fileInputSettingsRef.current) {
				fileInputSettingsRef.current.value = "";
			}
		}
	};

	const confirmImport = () => {
		if (importedSettings) {
			const {
				onboardingStatus: _onboardingStatus,
				onboardingStep: _onboardingStep,
				quickActionsIsOpen: _quickActionsIsOpen,
				lastBackupDate: _lastBackupDate,
				lastBackupReminderDismissedAt: _lastBackupReminderDismissedAt,
				...safeSettingsToImport
			} = importedSettings as Settings;

			updateSettings(safeSettingsToImport as Settings);
			gooeyToast.success("Settings synced successfully.", { showTimestamp: false });
		}
	};

	const handleDialogClose = (open: boolean) => {
		setImportPreviewOpen(open);
		if (!open) {
			setImportedSettings(null);
		}
	};

	return (
		<>
			<div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1 pr-4">
					<div className="flex items-center gap-2">
						<h4 className="text-sm font-semibold">Settings Data (JSON)</h4>
						<InfoTooltip
							ariaLabel="More information about Settings Data"
							content={
								<span>
									Exporting your settings saves all your appearance, sounds, and personal
									preferences into a JSON file, so you can easily transfer your setup to another
									device without configuring it again.
								</span>
							}
						/>
					</div>
					<p className="text-muted-foreground text-sm">Backup or restore your app configurations</p>
				</div>
				<div className="mt-2 grid w-full grid-cols-2 gap-2 sm:mt-0 sm:flex sm:w-auto sm:items-center">
					<Button
						variant="outline"
						size="sm"
						onClick={handleExportSettings}
						aria-label="Export settings"
						className="w-full gap-2 sm:w-auto"
					>
						<DownloadIcon className="h-3.5 w-3.5" />
						Export
					</Button>

					<div className="relative flex w-full flex-col items-center sm:w-auto sm:items-end">
						<Button
							variant="outline"
							size="sm"
							onClick={handleImportSettingsClick}
							aria-label="Import settings"
							className="w-full gap-2 sm:w-auto"
						>
							<UploadIcon className="h-3.5 w-3.5" />
							Import
						</Button>
					</div>
					<Input
						id="import-settings-file"
						type="file"
						accept=".json,application/json"
						className="hidden"
						ref={fileInputSettingsRef}
						onChange={handleSettingsFileChange}
						aria-label="Select file to import settings"
					/>
				</div>
			</div>

			<Suspense fallback={null}>
				{importPreviewOpen && importedSettings && (
					<SettingsImportPreviewDialog
						open={importPreviewOpen}
						onOpenChange={handleDialogClose}
						currentSettings={settings}
						importedSettings={importedSettings}
						onConfirm={confirmImport}
					/>
				)}
			</Suspense>
		</>
	);
}
