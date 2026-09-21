import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/user-avatar";
import { formatAgeDisplay } from "@/helpers";
import type { Birthday } from "@/types/birthday";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface BirthdayDateCelebrantsDialogProps {
	date: Date | null;
	celebrants: Birthday[];
	isOpen: boolean;
	onClose: () => void;
	currentDate: Date;
}

export function BirthdayDateCelebrantsDialog({
	date,
	celebrants,
	isOpen,
	onClose,
	currentDate,
}: BirthdayDateCelebrantsDialogProps) {
	if (!date || celebrants.length === 0) return null;

	const dateString = format(date, "MMMM d");

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="rounded-2xl border-border/50 bg-background/95 shadow-2xl backdrop-blur-md sm:max-w-md">
				<DialogHeader className="p-0 pb-4">
					<DialogTitle className="font-sans text-2xl font-bold tracking-wide text-foreground uppercase">
						{dateString}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{celebrants.length} birthday{celebrants.length === 1 ? "" : "s"}
					</DialogDescription>
				</DialogHeader>

				<div className="custom-scrollbar max-h-[60dvh] overflow-y-auto pr-4">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-4 p-3">
							{celebrants.map((celebrant) => {
								const ageDisplay = formatAgeDisplay(celebrant.birthday, currentDate);
								return (
									<Link
										key={celebrant.id}
										to={`/person/${celebrant.id}`}
										onClick={() => {
											onClose();
											window.scrollTo(0, 0);
										}}
										className="group -mx-2 flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
									>
										<div className="rounded-full bg-muted p-1 ring-1 ring-border transition-colors group-hover:bg-background">
											<UserAvatar birthday={celebrant} size={48} className="h-12 w-12" />
										</div>
										<div className="flex flex-col">
											<span className="text-lg font-semibold text-foreground">
												{celebrant.name}
											</span>
											<div className="flex items-center gap-2">
												{celebrant.relationship && (
													<>
														<span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
															{celebrant.relationship}
														</span>
														{ageDisplay !== null && (
															<span className="text-xs text-muted-foreground/50">•</span>
														)}
													</>
												)}
												{ageDisplay !== null && (
													<span className="text-xs font-medium text-muted-foreground">
														{ageDisplay}
													</span>
												)}
											</div>
										</div>
									</Link>
								);
							})}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
