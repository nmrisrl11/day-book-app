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
import { UserAvatar } from "@/components/user-avatar";

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
			<DialogContent className="border-border/50 bg-background/95 rounded-2xl shadow-2xl backdrop-blur-md sm:max-w-md">
				<DialogHeader className="border-b border-slate-100 p-0 pb-4">
					<DialogTitle className="text-foreground font-sans text-2xl font-bold tracking-wide uppercase">
						{monthName}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{birthdays.length === 0
							? "No birthdays this month."
							: `${birthdays.length} birthday${birthdays.length === 1 ? "" : "s"}`}
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[60vh] pr-4">
					{birthdays.length === 0 ? (
						<div className="text-muted-foreground py-12 text-center italic">
							No birthdays to celebrate in {monthName}.
						</div>
					) : (
						<div className="flex flex-col gap-6">
							{dateGroups.map(([date, celebrants]) => (
								<div key={date} className="flex flex-col gap-3">
									<h4 className="bg-background/95 text-muted-foreground sticky top-0 z-10 py-1 text-sm font-bold tracking-widest uppercase">
										{date}
									</h4>
									<div className="flex flex-col gap-4 p-3">
										{celebrants.map((celebrant) => (
											<div key={celebrant.id} className="flex items-center gap-4">
												<div className="bg-muted ring-border rounded-full p-1 ring-1">
													<UserAvatar birthday={celebrant} size={48} className="h-12 w-12" />
												</div>
												<span className="text-foreground text-lg font-semibold">
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
