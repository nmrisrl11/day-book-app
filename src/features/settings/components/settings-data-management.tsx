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
			<h3 className="text-base font-medium">Settings Data</h3>
			<div className="flex flex-col gap-3">
				<Button
					variant="outline"
					onClick={handleExportSettings}
					className="w-full justify-start"
					aria-label="Export settings"
				>
					<DownloadIcon className="mr-2 h-4 w-4" />
					Export Settings (JSON)
				</Button>

				<div className="flex flex-col gap-1.5">
					<Button
						variant="outline"
						onClick={handleImportSettingsClick}
						className="w-full justify-start"
						aria-label="Import settings"
					>
						<UploadIcon className="mr-2 h-4 w-4" />
						Import Settings (JSON)
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
