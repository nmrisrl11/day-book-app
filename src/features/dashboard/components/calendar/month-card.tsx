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
						"font-bold tracking-widest text-neutral-700 uppercase transition-colors group-hover:text-foreground",
						isCurrentMonth && "text-primary",
					)}
				>
					{monthName}
				</span>
				{isCurrentMonth && (
					<div
						className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-orange-300 to-red-500 text-white ring-2 ring-border"
						title="Current Month"
					>
						<CalendarHeartIcon className="h-3.5 w-3.5" />
						<span className="sr-only">Current month</span>
					</div>
				)}
			</div>

			<div className="flex h-14 w-full items-center rounded-2xl border border-border bg-muted/50 px-3 transition-all group-hover:bg-muted">
				{hasBirthdays ? (
					<div className="flex -space-x-3">
						{displayBirthdays.map((celebrant) => (
							<div
								key={celebrant.id}
								className="z-10 h-8 w-8 rounded-full bg-background ring-2 ring-border"
							>
								<UserAvatar birthday={celebrant} size={32} className="h-full w-full" />
							</div>
						))}
						{remainingCount > 0 && (
							<div className="z-20 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold ring-2 ring-border">
								+{remainingCount}
							</div>
						)}
					</div>
				) : (
					<span className="px-1 text-sm font-medium text-muted-foreground italic">
						No birthdays
					</span>
				)}
			</div>
		</button>
	);
}
