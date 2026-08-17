import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportBirthdays, parseImportedBirthdays } from "@/helpers/import-export";
import { parseIcsForBirthdays } from "@/helpers/calendar-import";
import { useDayBookStore } from "@/store/day-book-store";
import type { Birthday } from "@/types/birthday";
import { CalendarIcon, DownloadIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CalendarExportDialog } from "@/components/calendar/calendar-export-dialog";
import { CalendarImportDialog } from "@/components/calendar/calendar-import-dialog";

export function BirthdaysDataManagement() {
	const { birthdays, importData } = useDayBookStore();

	const fileInputBirthdaysRef = useRef<HTMLInputElement>(null);
	const fileInputIcsRef = useRef<HTMLInputElement>(null);

	const [importBirthdaysError, setImportBirthdaysError] = useState("");
	const [importIcsError, setImportIcsError] = useState("");

	const [exportCalendarOpen, setExportCalendarOpen] = useState(false);
	const [importCalendarOpen, setImportCalendarOpen] = useState(false);
	const [foundIcsBirthdays, setFoundIcsBirthdays] = useState<Birthday[]>([]);

	const birthdaysRef = useRef(birthdays);
	birthdaysRef.current = birthdays;

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	// --- JSON IMPORT/EXPORT ---
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

	// --- CALENDAR (.ICS) IMPORT/EXPORT ---
	const handleExportCalendarClick = () => {
		setExportCalendarOpen(true);
	};

	const handleImportIcsClick = () => {
		fileInputIcsRef.current?.click();
	};

	const handleIcsFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setImportIcsError("");
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const parsed = parseIcsForBirthdays(text);
			setFoundIcsBirthdays(parsed);
			setImportCalendarOpen(true);
		} catch (err) {
			setImportIcsError(err instanceof Error ? err.message : "Failed to parse calendar file.");
		} finally {
			if (fileInputIcsRef.current) {
				fileInputIcsRef.current.value = "";
			}
		}
	};

	const canImportJson = birthdays.length === 0;

	return (
		<>
			<div className="flex flex-col gap-6">
				{/* JSON DATA */}
				<div className="flex flex-col gap-3">
					<h3 className="text-base font-medium">Birthdays Data (JSON)</h3>
					<div className="flex flex-col gap-3">
						<Button
							variant="outline"
							onClick={handleExportBirthdays}
							className="w-full justify-start"
							aria-label="Export birthdays as JSON"
						>
							<DownloadIcon className="mr-2 h-4 w-4" />
							Export Birthdays (JSON)
						</Button>

						<div className="flex flex-col gap-1.5">
							<Button
								variant="outline"
								onClick={handleImportBirthdaysClick}
								className="w-full justify-start"
								disabled={!canImportJson}
								aria-label="Import birthdays from JSON"
							>
								<UploadIcon className="mr-2 h-4 w-4" />
								Import Birthdays (JSON)
							</Button>
							{!canImportJson && (
								<p className="text-muted-foreground mt-1.5 text-xs">
									JSON import is only available when you have no saved birthdays.
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
							aria-label="Select JSON file to import birthdays"
						/>
					</div>
				</div>

				{/* CALENDAR DATA */}
				<div className="flex flex-col gap-3">
					<h3 className="text-base font-medium">Calendar Integration</h3>
					<div className="flex flex-col gap-3">
						<Button
							variant="outline"
							onClick={handleExportCalendarClick}
							className="w-full justify-start"
							aria-label="Export birthdays to Calendar"
							disabled={birthdays.length === 0}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							Export All to Calendar
						</Button>

						<div className="flex flex-col gap-1.5">
							<Button
								variant="outline"
								onClick={handleImportIcsClick}
								className="w-full justify-start"
								aria-label="Import birthdays from Calendar"
							>
								<UploadIcon className="mr-2 h-4 w-4" />
								Import from Calendar (.ics)
							</Button>
							{importIcsError && (
								<p className="text-destructive mt-1.5 text-sm font-medium" role="alert">
									{importIcsError}
								</p>
							)}
						</div>
						<Input
							id="import-ics-file"
							type="file"
							accept=".ics,text/calendar"
							className="hidden"
							ref={fileInputIcsRef}
							onChange={handleIcsFileChange}
							aria-label="Select ICS file to import birthdays"
						/>
					</div>
				</div>
			</div>

			{exportCalendarOpen && (
				<CalendarExportDialog
					open={exportCalendarOpen}
					onOpenChange={setExportCalendarOpen}
					birthdays={birthdays}
				/>
			)}

			{importCalendarOpen && (
				<CalendarImportDialog
					open={importCalendarOpen}
					onOpenChange={setImportCalendarOpen}
					foundBirthdays={foundIcsBirthdays}
					onImportSuccess={() => setImportCalendarOpen(false)}
				/>
			)}
		</>
	);
}
