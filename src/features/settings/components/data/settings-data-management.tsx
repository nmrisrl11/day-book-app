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
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h3 className="text-base font-medium">Settings Data</h3>
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
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<Button
					variant="outline"
					onClick={handleExportSettings}
					className="hover:border-primary/50 flex h-24 flex-col items-center justify-center gap-2 rounded-xl border-dashed"
					aria-label="Export settings"
				>
					<DownloadIcon className="text-muted-foreground h-6 w-6" />
					<span>Export JSON</span>
				</Button>

				<div className="flex flex-col gap-1.5">
					<Button
						variant="outline"
						onClick={handleImportSettingsClick}
						className="hover:border-primary/50 flex h-24 flex-col items-center justify-center gap-2 rounded-xl border-dashed"
						aria-label="Import settings"
					>
						<UploadIcon className="text-muted-foreground h-6 w-6" />
						<span>Import JSON</span>
					</Button>
					{importSettingsError && (
						<p className="text-destructive mt-1.5 text-sm font-medium" role="alert">
							{importSettingsError}
						</p>
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
