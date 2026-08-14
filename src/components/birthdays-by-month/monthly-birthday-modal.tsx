import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatBirthdayDisplay } from "@/helpers/birthday-utils";
import type { Birthday } from "@/types/birthday";
import Avvvatars from "avvvatars-react";

interface MonthlyBirthdayModalProps {
	monthName: string;
	birthdays: Birthday[];
	isOpen: boolean;
	onClose: () => void;
}

export function MonthlyBirthdayModal({
	monthName,
	birthdays,
	isOpen,
	onClose,
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
			<DialogContent className="flex max-h-[85vh] flex-col gap-0 rounded-2xl border-border/50 bg-background/95 p-0 shadow-2xl backdrop-blur-md sm:max-w-md">
				<DialogHeader className="border-b border-slate-100 p-6 pb-4">
					<DialogTitle className="font-sans text-2xl font-bold tracking-wide text-foreground uppercase">
						{monthName}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{birthdays.length === 0
							? "No birthdays this month."
							: `${birthdays.length} birthday${birthdays.length === 1 ? "" : "s"}`}
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="flex-1 px-6 py-4">
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
										{celebrants.map((celebrant) => (
											<div key={celebrant.id} className="flex items-center gap-4">
												<div className="rounded-full bg-muted p-1 ring-1 ring-border">
													{celebrant.avatar ? (
														<img
															src={celebrant.avatar}
															alt={celebrant.name}
															className="h-12 w-12 rounded-full object-cover"
														/>
													) : (
														<div className="[&>svg]:h-12 [&>svg]:w-12">
															<Avvvatars value={celebrant.name} style="shape" size={48} />
														</div>
													)}
												</div>
												<span className="text-lg font-semibold text-foreground">
													{celebrant.name}
												</span>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
