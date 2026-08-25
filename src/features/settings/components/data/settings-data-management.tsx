import { InfoTooltip } from "@/components/info-tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportSettings, parseImportedSettings } from "@/helpers/import-export";
import { useDayBookStore } from "@/store/day-book-store";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";

export function SettingsDataManagement() {
	const { settings, updateSettings } = useDayBookStore();
	const fileInputSettingsRef = useRef<HTMLInputElement>(null);
	const [importSettingsError, setImportSettingsError] = useState("");

	const handleExportSettings = () => {
		exportSettings(settings);
	};

	const handleImportSettingsClick = () => {
		fileInputSettingsRef.current?.click();
	};

	const handleSettingsFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setImportSettingsError("");
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const importedSettings = parseImportedSettings(text);
			updateSettings(importedSettings);
		} catch (err) {
			setImportSettingsError(err instanceof Error ? err.message : "Failed to import settings.");
		} finally {
			if (fileInputSettingsRef.current) {
				fileInputSettingsRef.current.value = "";
			}
		}
	};

	return (
		<div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-col gap-1 pr-4">
				<div className="flex items-center gap-2">
					<h4 className="text-sm font-semibold">Settings Data (JSON)</h4>
					<InfoTooltip
						ariaLabel="More information about Settings Data"
						content={
							<span>
								Exporting your settings saves all your appearance, sounds, and personal preferences
								into a JSON file, so you can easily transfer your setup to another device without
								configuring it again.
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

				<div className="flex w-full flex-col items-center gap-1 sm:w-auto sm:items-end">
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
					{importSettingsError && (
						<span
							className="text-destructive text-center text-xs font-medium sm:text-right"
							role="alert"
						>
							{importSettingsError}
						</span>
					)}
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
	);
}
