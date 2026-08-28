import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/user-avatar";
import { formatAgeDisplay } from "@/helpers/birthday-utils";
import type { Birthday } from "@/types/birthday";
import { format } from "date-fns";

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
			<DialogContent className="border-border/50 bg-background/95 rounded-2xl shadow-2xl backdrop-blur-md sm:max-w-md">
				<DialogHeader className="p-0 pb-4">
					<DialogTitle className="text-foreground font-sans text-2xl font-bold tracking-wide uppercase">
						{dateString}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{celebrants.length} birthday{celebrants.length === 1 ? "" : "s"}
					</DialogDescription>
				</DialogHeader>

				<div className="custom-scrollbar max-h-[60vh] overflow-y-auto pr-4">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-4 p-3">
							{celebrants.map((celebrant) => {
								const ageDisplay = formatAgeDisplay(celebrant.birthday, currentDate);
								return (
									<div key={celebrant.id} className="flex items-center gap-4">
										<div className="bg-muted ring-border rounded-full p-1 ring-1">
											<UserAvatar birthday={celebrant} size={48} className="h-12 w-12" />
										</div>
										<div className="flex flex-col">
											<span className="text-foreground text-lg font-semibold">
												{celebrant.name}
											</span>
											<div className="flex items-center gap-2">
												{celebrant.relationship && (
													<>
														<span className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
															{celebrant.relationship}
														</span>
														{ageDisplay !== null && (
															<span className="text-muted-foreground/50 text-xs">•</span>
														)}
													</>
												)}
												{ageDisplay !== null && (
													<span className="text-muted-foreground text-xs font-medium">
														{ageDisplay}
													</span>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
