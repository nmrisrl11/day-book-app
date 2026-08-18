import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import type { Birthday } from "@/types/birthday";
import { CalendarHeartIcon } from "lucide-react";

interface MonthCardProps {
	monthName: string;
	monthIndex: number;
	birthdays: Birthday[];
	onClick: (monthIndex: number) => void;
}

export function MonthCard({ monthName, monthIndex, birthdays, onClick }: MonthCardProps) {
	const hasBirthdays = birthdays.length > 0;
	const isCurrentMonth = new Date().getMonth() === monthIndex;

	// Show up to 3 avatars, plus a counter for the rest
	const displayLimit = 3;
	const displayBirthdays = birthdays.slice(0, displayLimit);
	const remainingCount = Math.max(0, birthdays.length - displayLimit);

	return (
		<button
			onClick={() => onClick(monthIndex)}
			className="group flex w-full flex-col gap-2 rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
		>
			<div className="flex items-center gap-2 pl-2">
				<span
					className={cn(
						"group-hover:text-foreground font-bold tracking-widest text-neutral-700 uppercase transition-colors",
						isCurrentMonth && "text-primary",
					)}
				>
					{monthName}
				</span>
				{isCurrentMonth && (
					<div
						className="ring-border flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-orange-300 to-red-500 text-white ring-2"
						title="Current Month"
					>
						<CalendarHeartIcon className="h-3.5 w-3.5" />
						<span className="sr-only">Current month</span>
					</div>
				)}
			</div>

			<div className="border-border bg-muted/50 group-hover:bg-muted flex h-14 w-full items-center rounded-2xl border px-3 transition-all">
				{hasBirthdays ? (
					<div className="flex -space-x-3">
						{displayBirthdays.map((celebrant) => (
							<div
								key={celebrant.id}
								className="bg-background ring-border z-10 h-8 w-8 rounded-full ring-2"
							>
								<UserAvatar birthday={celebrant} size={32} className="h-full w-full" />
							</div>
						))}
						{remainingCount > 0 && (
							<div className="bg-muted text-muted-foreground ring-border z-20 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-2">
								+{remainingCount}
							</div>
						)}
					</div>
				) : (
					<span className="text-muted-foreground px-1 text-sm font-medium italic">
						No birthdays
					</span>
				)}
			</div>
		</button>
	);
}
