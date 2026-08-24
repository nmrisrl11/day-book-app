import { InfoTooltip } from "@/components/info-tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_INFO } from "@/constants/app-info";
import { CalendarExportDialog } from "@/features/calendar/components/calendar-export-dialog";
import { parseIcsForBirthdays } from "@/helpers/calendar-import";
import { exportBirthdays, parseImportedBirthdays } from "@/helpers/import-export";
import { db } from "@/lib/db";
import type { Birthday } from "@/types/birthday";
import { useLiveQuery } from "dexie-react-hooks";
import { CalendarIcon, DownloadIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ImportPreviewDialog } from "./import-preview-dialog";

export function BirthdaysDataManagement() {
	const birthdays = useLiveQuery(() => db.birthdays.toArray(), []) ?? [];

	const fileInputBirthdaysRef = useRef<HTMLInputElement>(null);
	const fileInputIcsRef = useRef<HTMLInputElement>(null);

	const [importBirthdaysError, setImportBirthdaysError] = useState("");
	const [importIcsError, setImportIcsError] = useState("");

	const [exportCalendarOpen, setExportCalendarOpen] = useState(false);
	const [importCalendarOpen, setImportCalendarOpen] = useState(false);
	const [importJsonOpen, setImportJsonOpen] = useState(false);
	const [foundIcsBirthdays, setFoundIcsBirthdays] = useState<Birthday[]>([]);
	const [foundJsonBirthdays, setFoundJsonBirthdays] = useState<Birthday[]>([]);

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

			if (!isMounted.current) {
				return;
			}

			const importedBirthdays = parseImportedBirthdays(text);
			setFoundJsonBirthdays(importedBirthdays);
			setImportJsonOpen(true);
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

	return (
		<>
			<div className="flex flex-col gap-6">
				{/* JSON DATA */}
				<div className="bg-card flex flex-col gap-4 rounded-xl border p-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-base font-semibold">Birthdays Data (JSON)</h3>
							<p className="text-muted-foreground text-sm">Backup or restore your raw data</p>
						</div>
						<InfoTooltip
							ariaLabel="More information about JSON format"
							content={
								<span>
									<strong>JSON</strong> is the standard format {APP_INFO.name} uses to save your raw
									data. Exporting this creates a complete backup of all your people, dates, and
									notes, which you can safely import into another device.
								</span>
							}
						/>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<Button
							variant="outline"
							onClick={handleExportBirthdays}
							className="h-12 w-full gap-2 rounded-lg"
							disabled={birthdays.length === 0}
							aria-label="Export birthdays as JSON"
						>
							<DownloadIcon className="h-4 w-4" />
							<span>Export JSON</span>
						</Button>

						<div className="flex flex-col gap-1.5">
							<Button
								variant="outline"
								onClick={handleImportBirthdaysClick}
								className="h-12 w-full gap-2 rounded-lg"
								aria-label="Import birthdays from JSON"
							>
								<UploadIcon className="h-4 w-4" />
								<span>Import JSON</span>
							</Button>
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
				<div className="bg-card flex flex-col gap-4 rounded-xl border p-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-base font-semibold">Calendar Integration</h3>
							<p className="text-muted-foreground text-sm">Sync with your favorite calendar apps</p>
						</div>
						<InfoTooltip
							ariaLabel="More information about Calendar Integration"
							content={
								<span>
									<strong>.ics (iCalendar)</strong> is a universal calendar format. Exporting an
									.ics file allows you to seamlessly add your birthdays to Apple Calendar, Google
									Calendar, or Outlook!
								</span>
							}
						/>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<Button
							variant="outline"
							onClick={handleExportCalendarClick}
							className="h-12 w-full gap-2 rounded-lg"
							aria-label="Export birthdays to Calendar"
							disabled={birthdays.length === 0}
						>
							<CalendarIcon className="h-4 w-4" />
							<span className="text-center">Export to Calendar</span>
						</Button>

						<div className="flex flex-col gap-1.5">
							<Button
								variant="outline"
								onClick={handleImportIcsClick}
								className="h-12 w-full gap-2 rounded-lg"
								aria-label="Import birthdays from Calendar"
							>
								<UploadIcon className="h-4 w-4" />
								<span className="text-center">Import from (.ics)</span>
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
				<ImportPreviewDialog
					source="ics"
					open={importCalendarOpen}
					onOpenChange={(open) => {
						setImportCalendarOpen(open);
						if (!open) setFoundIcsBirthdays([]);
					}}
					foundBirthdays={foundIcsBirthdays}
					onImportSuccess={() => {
						setImportCalendarOpen(false);
						setFoundIcsBirthdays([]);
					}}
				/>
			)}

			{importJsonOpen && (
				<ImportPreviewDialog
					source="json"
					open={importJsonOpen}
					onOpenChange={(open) => {
						setImportJsonOpen(open);
						if (!open) setFoundJsonBirthdays([]);
					}}
					foundBirthdays={foundJsonBirthdays}
					onImportSuccess={() => {
						setImportJsonOpen(false);
						setFoundJsonBirthdays([]);
					}}
				/>
			)}
		</>
	);
}
