import { PartyHat } from "@/components/icons/party-hat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/user-avatar";
import { GREETINGS } from "@/constants/greetings";
import { CalendarExportDialog } from "@/features/calendar/components/calendar-export-dialog";
import { formatAgeDisplay, formatBirthdayDisplay } from "@/helpers/birthday-utils";
import { useDayBookStore } from "@/store/day-book-store";
import { type Birthday } from "@/types/birthday";
import {
	CalendarIcon,
	CalendarPlusIcon,
	GiftIcon,
	QuoteIcon,
	StarIcon,
	StickyNoteIcon,
	UsersIcon,
} from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useMemo, useState } from "react";

interface CelebrantModalProps {
	celebrant: Birthday | null;
	isOpen: boolean;
	onClose: () => void;
	currentDate: Date;
}

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1, delayChildren: 0.05 },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 15 },
	show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 25 } },
};

export function CelebrantModal({ celebrant, isOpen, onClose, currentDate }: CelebrantModalProps) {
	const { settings } = useDayBookStore();
	const [exportOpen, setExportOpen] = useState(false);

	// Randomly select a greeting when the modal opens
	const greeting = useMemo(() => {
		if (!celebrant) return "";
		const greetingsList =
			settings.customGreetingsEnabled && settings.greetings && settings.greetings.length > 0
				? settings.greetings
				: GREETINGS;
		const randomIndex = Math.floor(Math.random() * greetingsList.length);
		return greetingsList[randomIndex];
	}, [celebrant, settings.greetings, settings.customGreetingsEnabled]);

	if (!celebrant) return null;

	const ageDisplay = formatAgeDisplay(celebrant.birthday, currentDate);
	const formattedDate = formatBirthdayDisplay(celebrant.birthday);

	return (
		<>
			<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
				<DialogContent className="border-border/40 bg-background/95 flex max-h-[90vh] flex-col overflow-hidden rounded-3xl p-0 shadow-2xl backdrop-blur-xl sm:max-w-md">
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="show"
						className="custom-scrollbar flex flex-1 w-full flex-col items-center gap-5 overflow-y-auto overflow-x-hidden p-5 sm:p-6"
					>
						<DialogHeader className="flex w-full flex-col items-center gap-3 text-center">
							<motion.div variants={itemVariants} className="relative">
								<div className="absolute -inset-6 animate-pulse rounded-full bg-[radial-gradient(circle_at_center,var(--color-primary),transparent_60%)] opacity-15 blur-2xl" />

								<div className="absolute -top-3 -right-2 z-20 h-10 w-10 rotate-20 drop-shadow-lg sm:-top-4 sm:-right-2.5 sm:h-12 sm:w-12">
									<PartyHat className="h-full w-full" />
								</div>

								<div className="bg-background ring-border/50 relative z-10 rounded-full p-1.5 shadow-xl ring-1">
									<UserAvatar
										birthday={celebrant}
										size={96}
										className="h-20 w-20 sm:h-24 sm:w-24"
									/>
								</div>
							</motion.div>

							<motion.div variants={itemVariants} className="flex flex-col items-center gap-1">
								<DialogTitle className="text-foreground font-sans text-2xl font-extrabold tracking-tight sm:text-3xl">
									{celebrant.name}
								</DialogTitle>
							</motion.div>
						</DialogHeader>

						<motion.div variants={itemVariants} className="w-full">
							<div className="bg-secondary/30 border-border/40 relative w-full rounded-2xl border p-4 shadow-sm">
								<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
									<div className="flex flex-col items-center gap-1.5">
										<span className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
											<CalendarIcon className="h-3 w-3" /> Date
										</span>
										<span className="text-foreground text-sm font-semibold">{formattedDate}</span>
									</div>

									{ageDisplay !== null && (
										<div className="flex flex-col items-center gap-1.5">
											<span className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
												<GiftIcon className="h-3 w-3" /> Turning
											</span>
											<span className="text-foreground text-sm font-semibold">{ageDisplay}</span>
										</div>
									)}

									{celebrant.relationship && (
										<div className="flex flex-col items-center gap-1.5">
											<span className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
												<UsersIcon className="h-3 w-3" /> Relationship
											</span>
											<span className="text-foreground text-sm font-semibold capitalize">
												{celebrant.relationship}
											</span>
										</div>
									)}
								</div>
							</div>
						</motion.div>

						<motion.div variants={itemVariants} className="w-full">
							<div className="bg-primary/5 border-primary/20 relative w-full overflow-hidden rounded-2xl border p-4 text-center shadow-sm">
								<div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
									<QuoteIcon className="h-24 w-24" />
								</div>
								<p className="text-primary/80 relative z-10 text-sm leading-relaxed font-medium italic">
									"{greeting}"
								</p>
							</div>
						</motion.div>

						{celebrant.giftIdeas && celebrant.giftIdeas.length > 0 && (
							<motion.div variants={itemVariants} className="w-full">
								<div className="bg-amber-500/5 border-amber-500/20 relative w-full overflow-hidden rounded-2xl border p-4 text-left shadow-sm">
									<div className="absolute top-0 right-0 p-3 opacity-5">
										<GiftIcon className="h-20 w-20" />
									</div>
									<h4 className="text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
										<StarIcon className="h-3.5 w-3.5 fill-amber-500/50" />
										Wishlist & Gift Ideas
									</h4>
									<div className="relative z-10 flex flex-wrap gap-2">
										{celebrant.giftIdeas.map((idea, index) => (
											<Badge
												key={index}
												variant="outline"
												className="border-amber-500/30 shadow-black/5 bg-background/50 h-auto max-w-full whitespace-normal wrap-break-word text-left shadow-sm backdrop-blur-sm"
											>
												<span
													className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/80"
													data-icon="inline-start"
												/>
												<span className="min-w-0 wrap-break-word">{idea}</span>
											</Badge>
										))}
									</div>
								</div>
							</motion.div>
						)}

						{celebrant.notes && celebrant.notes.length > 0 && (
							<motion.div variants={itemVariants} className="w-full">
								<div className="bg-blue-500/5 border-blue-500/20 relative w-full overflow-hidden rounded-2xl border p-4 text-left shadow-sm">
									<div className="absolute top-0 right-0 p-3 opacity-5">
										<StickyNoteIcon className="h-20 w-20" />
									</div>
									<h4 className="text-blue-800 dark:text-blue-400 mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
										<StickyNoteIcon className="h-3.5 w-3.5 fill-blue-500/50" />
										Notes & Details
									</h4>
									<div className="relative z-10 flex flex-wrap gap-2">
										{celebrant.notes.map((note, index) => (
											<Badge
												key={index}
												variant="outline"
												className="border-blue-500/30 shadow-black/5 bg-background/50 h-auto max-w-full whitespace-normal wrap-break-word text-left shadow-sm backdrop-blur-sm"
											>
												<span
													className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/80"
													data-icon="inline-start"
												/>
												<span className="min-w-0 wrap-break-word">{note}</span>
											</Badge>
										))}
									</div>
								</div>
							</motion.div>
						)}
					</motion.div>

					<DialogFooter className="bg-muted/50 border-border/40 m-0 shrink-0 border-t p-4 sm:justify-center">
						<Button
							variant="outline"
							className="bg-background hover:bg-accent/50 w-full gap-2 font-semibold shadow-sm transition-colors"
							onClick={() => setExportOpen(true)}
						>
							<CalendarPlusIcon className="h-4 w-4" />
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
