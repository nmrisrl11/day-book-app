import { PartyHat } from "@/components/icons/party-hat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/user-avatar";
import { CalendarExportDialog } from "@/features/calendar/components/calendar-export-dialog";
import { calculateAge, formatBirthdayDisplay } from "@/helpers/birthday-utils";
import { useDayBookStore } from "@/store/day-book-store";
import { type Birthday } from "@/types/birthday";
import { CalendarIcon, CalendarPlus, GiftIcon } from "lucide-react";
import { useMemo, useState } from "react";

interface CelebrantModalProps {
	celebrant: Birthday | null;
	isOpen: boolean;
	onClose: () => void;
	currentDate: Date;
}

export function CelebrantModal({ celebrant, isOpen, onClose, currentDate }: CelebrantModalProps) {
	const { settings } = useDayBookStore();
	const [exportOpen, setExportOpen] = useState(false);

	// Randomly select a greeting when the modal opens
	const greeting = useMemo(() => {
		if (!celebrant) return "";
		const greetingsList =
			settings.greetings && settings.greetings.length > 0
				? settings.greetings
				: ["Happy Birthday!"];
		const randomIndex = Math.floor(Math.random() * greetingsList.length);
		return greetingsList[randomIndex];
	}, [celebrant, settings.greetings]); // Re-roll greeting if a new celebrant is opened

	if (!celebrant) return null;

	const age = calculateAge(celebrant.birthday, currentDate);
	const formattedDate = formatBirthdayDisplay(celebrant.birthday);

	return (
		<>
			<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
				<DialogContent className="border-border/50 bg-background/90 rounded-2xl shadow-2xl sm:max-w-md">
					<DialogHeader className="flex flex-col items-center space-y-3 py-6 text-center">
						<div className="relative">
							<div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle_at_center,var(--color-blue-500),transparent_70%)] opacity-30" />

							<div className="absolute -top-9 right-0 z-20 h-14 w-14 rotate-12 drop-shadow-md">
								<PartyHat className="h-full w-full" />
							</div>

							<div className="bg-background ring-border relative z-10 rounded-full p-2 shadow-sm ring-1">
								<UserAvatar birthday={celebrant} size={96} className="h-24 w-24" />
							</div>
						</div>

						<DialogTitle className="text-foreground flex flex-col items-center gap-1 font-sans text-2xl font-bold">
							<span>{celebrant.name}</span>
							{celebrant.relationship && (
								<span className="text-muted-foreground text-sm font-normal tracking-wider uppercase">
									{celebrant.relationship}
								</span>
							)}
						</DialogTitle>

						<DialogDescription asChild>
							<div className="text-muted-foreground mt-2 flex flex-col items-center gap-4">
								<div className="flex flex-wrap items-center justify-center gap-3">
									<Badge variant="secondary" className="p-3 text-sm font-bold">
										<CalendarIcon data-icon="inline-start" />
										{formattedDate}
									</Badge>

									{age !== null && (
										<Badge variant="destructive" className="p-3 text-sm font-bold">
											<GiftIcon data-icon="inline-start" />
											Now {age} years old
										</Badge>
									)}
								</div>

								<p className="text-secondary-foreground text-base leading-relaxed italic">
									"{greeting}"
								</p>

								{celebrant.notes && celebrant.notes.length > 0 && (
									<div className="flex flex-wrap items-center justify-center gap-2 pt-1">
										{celebrant.notes.map((note, idx) => (
											<span
												key={idx}
												className="bg-primary/5 text-primary border-primary/10 rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm"
											>
												{note}
											</span>
										))}
									</div>
								)}
							</div>
						</DialogDescription>
					</DialogHeader>

					<DialogFooter className="border-border/50 border-t pt-4 sm:justify-center">
						<Button variant="outline" className="w-full gap-2" onClick={() => setExportOpen(true)}>
							<CalendarPlus className="h-4 w-4" />
							Add to Calendar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{exportOpen && (
				<CalendarExportDialog
					open={exportOpen}
					onOpenChange={setExportOpen}
					birthdays={celebrant}
				/>
			)}
		</>
	);
}
