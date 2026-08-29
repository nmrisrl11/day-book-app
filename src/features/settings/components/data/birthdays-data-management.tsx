import { InfoTooltip } from "@/components/info-tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_INFO } from "@/constants/app-info";
import { CalendarExportDialog } from "@/features/calendar/components/calendar-export-dialog";
import { parseIcsForBirthdays } from "@/helpers/calendar-import";
import { exportBirthdays, parseImportedBirthdays } from "@/helpers/import-export";
import { useCurrentDate } from "@/hooks/use-current-date";
import { db } from "@/lib/db";
import type { Birthday } from "@/types/birthday";
import { useDayBookStore } from "@/store/day-book-store";
import { useLiveQuery } from "dexie-react-hooks";
import { gooeyToast } from "goey-toast";
import { CalendarIcon, DownloadIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ImportPreviewDialog } from "./import-preview-dialog";

export function BirthdaysDataManagement() {
	const currentDate = useCurrentDate();
	const birthdays = useLiveQuery(() => db.birthdays.toArray(), []) ?? [];
	const updateSettings = useDayBookStore((state) => state.updateSettings);

	const fileInputBirthdaysRef = useRef<HTMLInputElement>(null);
	const fileInputIcsRef = useRef<HTMLInputElement>(null);

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
		updateSettings({ lastBackupDate: new Date().toISOString() });
	};

	const handleImportBirthdaysClick = () => {
		fileInputBirthdaysRef.current?.click();
	};

	const handleBirthdaysFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();

			if (!isMounted.current) {
				return;
			}

			const importedBirthdays = parseImportedBirthdays(text, currentDate);
			setFoundJsonBirthdays(importedBirthdays);
			setImportJsonOpen(true);
		} catch (err) {
			gooeyToast.error("Import Failed", {
				id: "import-error",
				description: err instanceof Error ? err.message : "Failed to import birthdays.",
				showTimestamp: false,
			});
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
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const parsed = parseIcsForBirthdays(text);
			setFoundIcsBirthdays(parsed);
			setImportCalendarOpen(true);
		} catch (err) {
			gooeyToast.error("Import Failed", {
				id: "import-error",
				description: err instanceof Error ? err.message : "Failed to parse calendar file.",
				showTimestamp: false,
			});
		} finally {
			if (fileInputIcsRef.current) {
				fileInputIcsRef.current.value = "";
			}
		}
	};

	return (
		<>
			{/* JSON DATA */}
			<div className="flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1 pr-4">
					<div className="flex items-center gap-2">
						<h4 className="text-sm font-semibold">Birthdays Data (JSON)</h4>
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
					<p className="text-muted-foreground text-sm">Backup or restore your raw data</p>
				</div>
				<div className="mt-2 grid w-full grid-cols-2 gap-2 sm:mt-0 sm:flex sm:w-auto sm:items-center">
					<Button
						variant="outline"
						size="sm"
						onClick={handleExportBirthdays}
						disabled={birthdays.length === 0}
						aria-label="Export birthdays as JSON"
						className="w-full gap-2 sm:w-auto"
					>
						<DownloadIcon className="h-3.5 w-3.5" />
						Export
					</Button>

					<div className="relative flex w-full flex-col items-center sm:w-auto sm:items-end">
						<Button
							variant="outline"
							size="sm"
							onClick={handleImportBirthdaysClick}
							aria-label="Import birthdays from JSON"
							className="w-full gap-2 sm:w-auto"
						>
							<UploadIcon className="h-3.5 w-3.5" />
							Import
						</Button>
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
			<div className="flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1 pr-4">
					<div className="flex items-center gap-2">
						<h4 className="text-sm font-semibold">Calendar Integration</h4>
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
					<p className="text-muted-foreground text-sm">Sync with your favorite calendar apps</p>
				</div>
				<div className="mt-2 grid w-full grid-cols-2 gap-2 sm:mt-0 sm:flex sm:w-auto sm:items-center">
					<Button
						variant="outline"
						size="sm"
						onClick={handleExportCalendarClick}
						disabled={birthdays.length === 0}
						aria-label="Export birthdays to Calendar"
						className="w-full gap-2 sm:w-auto"
					>
						<CalendarIcon className="h-3.5 w-3.5" />
						Export
					</Button>

					<div className="relative flex w-full flex-col items-center sm:w-auto sm:items-end">
						<Button
							variant="outline"
							size="sm"
							onClick={handleImportIcsClick}
							aria-label="Import birthdays from Calendar"
							className="w-full gap-2 sm:w-auto"
						>
							<UploadIcon className="h-3.5 w-3.5" />
							Import
						</Button>
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
