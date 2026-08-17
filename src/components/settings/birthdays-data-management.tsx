import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportBirthdays, parseImportedBirthdays } from "@/helpers/import-export";
import { useDayBookStore } from "@/store/day-book-store";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function BirthdaysDataManagement() {
	const { birthdays, importData } = useDayBookStore();
	const fileInputBirthdaysRef = useRef<HTMLInputElement>(null);
	const [importBirthdaysError, setImportBirthdaysError] = useState("");

	const birthdaysRef = useRef(birthdays);
	birthdaysRef.current = birthdays;

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleExportBirthdays = () => {
		exportBirthdays(birthdays);
	};

	const handleImportBirthdaysClick = () => {
		fileInputBirthdaysRef.current?.click();
	};

	const handleBirthdaysFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setImportBirthdaysError("");
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();

			if (!isMounted.current || birthdaysRef.current.length !== 0) {
				return;
			}

			const importedBirthdays = parseImportedBirthdays(text);
			importData(importedBirthdays);
		} catch (err) {
			setImportBirthdaysError(err instanceof Error ? err.message : "Failed to import birthdays.");
		} finally {
			if (fileInputBirthdaysRef.current) {
				fileInputBirthdaysRef.current.value = "";
			}
		}
	};

	const canImport = birthdays.length === 0;

	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-base font-medium">Birthdays Data</h3>
			<div className="flex flex-col gap-3">
				<Button
					variant="outline"
					onClick={handleExportBirthdays}
					className="w-full justify-start"
					aria-label="Export birthdays"
				>
					<DownloadIcon className="mr-2 h-4 w-4" />
					Export Birthdays (JSON)
				</Button>

				<div className="flex flex-col gap-1.5">
					<Button
						variant="outline"
						onClick={handleImportBirthdaysClick}
						className="w-full justify-start"
						disabled={!canImport}
						aria-label="Import birthdays"
					>
						<UploadIcon className="mr-2 h-4 w-4" />
						Import Birthdays (JSON)
					</Button>
					{!canImport && (
						<p className="text-muted-foreground mt-1.5 text-xs">
							Import is only available when you have no saved birthdays.
						</p>
					)}
					{importBirthdaysError && (
						<p className="text-destructive mt-1.5 text-sm font-medium" role="alert">
							{importBirthdaysError}
						</p>
					)}
				</div>
				<Input
					id="import-birthdays-file"
					type="file"
					accept=".json,application/json"
					className="hidden"
					ref={fileInputBirthdaysRef}
					onChange={handleBirthdaysFileChange}
					aria-label="Select file to import birthdays"
				/>
			</div>
		</div>
	);
}
