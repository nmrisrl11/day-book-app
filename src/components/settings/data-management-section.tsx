import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDayBook } from "@/context/day-book-context";
import { exportBirthdays, parseImportedBirthdays } from "@/helpers/import-export";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";

export function DataManagementSection() {
	const { birthdays, importData } = useDayBook();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [importError, setImportError] = useState("");

	const handleExport = () => {
		exportBirthdays(birthdays);
	};

	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setImportError("");
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const importedBirthdays = parseImportedBirthdays(text);
			importData(importedBirthdays);
		} catch (err) {
			setImportError(err instanceof Error ? err.message : "Failed to import data.");
		} finally {
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const canImport = birthdays.length === 0;

	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-base font-medium">Data Management</h3>
			<div className="flex flex-col gap-2">
				<Button
					variant="outline"
					onClick={handleExport}
					className="w-full justify-start"
					aria-label="Export birthdays"
				>
					<DownloadIcon className="mr-2 h-4 w-4" />
					Export Birthdays (JSON)
				</Button>

				<div className="flex flex-col gap-1">
					<Button
						variant="outline"
						onClick={handleImportClick}
						className="w-full justify-start"
						disabled={!canImport}
						aria-label="Import birthdays"
					>
						<UploadIcon className="mr-2 h-4 w-4" />
						Import Birthdays (JSON)
					</Button>
					{!canImport && (
						<p className="text-muted-foreground mt-1 text-xs">
							Import is only available when you have no saved birthdays.
						</p>
					)}
					{importError && (
						<p className="text-destructive mt-1 text-sm font-medium" role="alert">
							{importError}
						</p>
					)}
				</div>
				<Input
					id="import-file"
					name="import-file"
					type="file"
					accept=".json,application/json"
					className="hidden"
					ref={fileInputRef}
					onChange={handleFileChange}
					aria-label="Select file to import birthdays"
				/>
			</div>
		</div>
	);
}
