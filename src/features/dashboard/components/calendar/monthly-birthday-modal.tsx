import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/user-avatar";
import { formatAgeDisplay, formatBirthdayDisplay } from "@/helpers/birthday-utils";
import type { Birthday } from "@/types/birthday";
import { Link } from "react-router-dom";

interface MonthlyBirthdayModalProps {
	monthName: string;
	birthdays: Birthday[];
	isOpen: boolean;
	onClose: () => void;
	currentDate: Date;
}

export function MonthlyBirthdayModal({
	monthName,
	birthdays,
	isOpen,
	onClose,
	currentDate,
}: MonthlyBirthdayModalProps) {
	// Group birthdays by formatted date (e.g., "August 20")
	const groupedBirthdays = birthdays.reduce(
		(acc, curr) => {
			const formattedDate = formatBirthdayDisplay(curr.birthday);
			if (!acc[formattedDate]) acc[formattedDate] = [];
			acc[formattedDate].push(curr);
			return acc;
		},
		{} as Record<string, Birthday[]>,
	);

	const dateGroups = Object.entries(groupedBirthdays);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="rounded-2xl border-border/50 bg-background/95 shadow-2xl backdrop-blur-md sm:max-w-md">
				<DialogHeader className="p-0 pb-4">
					<DialogTitle className="font-sans text-2xl font-bold tracking-wide text-foreground uppercase">
						{monthName}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{birthdays.length === 0
							? "No birthdays this month."
							: `${birthdays.length} birthday${birthdays.length === 1 ? "" : "s"}`}
					</DialogDescription>
				</DialogHeader>

				<div className="custom-scrollbar max-h-[60vh] overflow-y-auto pr-4">
					{birthdays.length === 0 ? (
						<div className="py-12 text-center text-muted-foreground italic">
							No birthdays to celebrate in {monthName}.
						</div>
					) : (
						<div className="flex flex-col gap-6">
							{dateGroups.map(([date, celebrants]) => (
								<div key={date} className="flex flex-col gap-3">
									<h4 className="sticky top-0 z-10 bg-background/95 py-1 text-sm font-bold tracking-widest text-muted-foreground uppercase">
										{date}
									</h4>
									<div className="flex flex-col gap-4 p-3">
										{celebrants.map((celebrant) => {
											const ageDisplay = formatAgeDisplay(celebrant.birthday, currentDate);
											return (
												<Link
													key={celebrant.id}
													to={`/person/${celebrant.id}`}
													onClick={onClose}
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
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
