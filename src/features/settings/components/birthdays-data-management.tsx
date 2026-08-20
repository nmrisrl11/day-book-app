import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarExportDialog } from "@/features/calendar/components/calendar-export-dialog";
import { ImportPreviewDialog } from "@/features/settings/components/import-preview-dialog";
import { parseIcsForBirthdays } from "@/helpers/calendar-import";
import { exportBirthdays, parseImportedBirthdays } from "@/helpers/import-export";
import { useDayBookStore } from "@/store/day-book-store";
import type { Birthday } from "@/types/birthday";
import { gooeyToast } from "goey-toast";
import { CalendarIcon, DownloadIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function BirthdaysDataManagement() {
	const { birthdays } = useDayBookStore();

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

	const toImport = [{}];
	const alreadyExistedCount = 1;

	return (
		<>
			<div className="flex flex-col gap-6">
				{/* JSON DATA */}
				<div className="flex flex-col gap-3">
					<h3
						className="text-base font-medium"
						onClick={() => {
							gooeyToast.success(`Import Complete!`, {
								id: "import-complete",
								description: (
									<div>
										<span className="font-semibold">{toImport.length}</span> birthday
										{toImport.length === 1 ? "" : "s"} {toImport.length === 1 ? "has" : "have"} been
										added successfully. <br />
										<span className="font-semibold">{alreadyExistedCount}</span>{" "}
										{alreadyExistedCount === 1 ? "birthday was" : "birthdays were"} already there.
									</div>
								),
								showTimestamp: false,
								classNames: {
									content: "items-center text-center",
									title: "text-center w-full",
									description: "text-center! justify-center flex w-full",
								},
								duration: Infinity,
								timing: { displayDuration: 86400000 },
							});
						}}
					>
						Birthdays Data (JSON)
					</h3>
					<div className="flex flex-col gap-3">
						<Button
							variant="outline"
							onClick={handleExportBirthdays}
							className="w-full justify-start"
							disabled={birthdays.length === 0}
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
								aria-label="Import birthdays from JSON"
							>
								<UploadIcon className="mr-2 h-4 w-4" />
								Import Birthdays (JSON)
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
				<ImportPreviewDialog
					source="ics"
					open={importCalendarOpen}
					onOpenChange={setImportCalendarOpen}
					foundBirthdays={foundIcsBirthdays}
					onImportSuccess={() => setImportCalendarOpen(false)}
				/>
			)}

			{importJsonOpen && (
				<ImportPreviewDialog
					source="json"
					open={importJsonOpen}
					onOpenChange={setImportJsonOpen}
					foundBirthdays={foundJsonBirthdays}
					onImportSuccess={() => setImportJsonOpen(false)}
				/>
			)}
		</>
	);
}
