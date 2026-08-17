import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	downloadIcsFile,
	generateGoogleCalendarUrl,
	generateIcsContent,
} from "@/helpers/calendar-export";
import type { Birthday } from "@/types/birthday";
import { CalendarIcon, DownloadIcon } from "lucide-react";

interface CalendarExportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	birthdays: Birthday | Birthday[];
}

export function CalendarExportDialog({ open, onOpenChange, birthdays }: CalendarExportDialogProps) {
	const isSingle = !Array.isArray(birthdays);
	const title = isSingle ? `Export ${birthdays.name}'s Birthday` : "Export Birthdays";

	const handleGoogleExport = () => {
		if (isSingle) {
			const url = generateGoogleCalendarUrl(birthdays);
			window.open(url, "_blank", "noopener,noreferrer");
			onOpenChange(false);
		}
	};

	const handleIcsExport = () => {
		const content = generateIcsContent(birthdays);
		const filename = isSingle
			? `${birthdays.name.replace(/\s+/g, "_")}_birthday.ics`
			: `daybook_birthdays_${new Date().toISOString().split("T")[0]}.ics`;
		downloadIcsFile(content, filename);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						This will create calendar events containing birthday information. DayBook does not
						control how external calendar services store or manage this information.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3 py-4">
					<h3 className="text-foreground text-sm font-semibold">Export to</h3>

					{isSingle && (
						<Button
							variant="outline"
							className="w-full justify-start"
							onClick={handleGoogleExport}
							aria-label="Add to Google Calendar"
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							Google Calendar
						</Button>
					)}

					<Button
						variant="outline"
						className="w-full justify-start"
						onClick={handleIcsExport}
						aria-label="Export for Apple Calendar"
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						Apple Calendar (.ics)
					</Button>

					<Button
						variant="outline"
						className="w-full justify-start"
						onClick={handleIcsExport}
						aria-label="Export for Outlook"
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						Outlook (.ics)
					</Button>

					<div className="my-2 border-t" />

					<Button
						variant="secondary"
						className="w-full justify-start"
						onClick={handleIcsExport}
						aria-label="Download .ics File"
					>
						<DownloadIcon className="mr-2 h-4 w-4" />
						Download .ics File
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
