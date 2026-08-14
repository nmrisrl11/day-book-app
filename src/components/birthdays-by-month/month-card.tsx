import type { Birthday } from "@/types/birthday";
import Avvvatars from "avvvatars-react";

interface MonthCardProps {
	monthName: string;
	monthIndex: number;
	birthdays: Birthday[];
	onClick: (monthIndex: number) => void;
}

export function MonthCard({ monthName, monthIndex, birthdays, onClick }: MonthCardProps) {
	const hasBirthdays = birthdays.length > 0;

	// Show up to 3 avatars, plus a counter for the rest
	const displayLimit = 3;
	const displayBirthdays = birthdays.slice(0, displayLimit);
	const remainingCount = Math.max(0, birthdays.length - displayLimit);

	return (
		<button
			onClick={() => onClick(monthIndex)}
			className="group flex w-full flex-col gap-2 rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
		>
			<span className="text-foreground pl-2 font-bold tracking-widest uppercase transition-colors group-hover:text-neutral-700">
				{monthName}
			</span>

			<div className="border-border bg-muted/50 group-hover:bg-muted flex h-14 w-full items-center rounded-2xl border px-3 transition-colors">
				{hasBirthdays ? (
					<div className="flex -space-x-3">
						{displayBirthdays.map((celebrant) => (
							<div
								key={celebrant.id}
								className="bg-background ring-border z-10 h-8 w-8 rounded-full ring-2"
							>
								{celebrant.avatar ? (
									<img
										src={celebrant.avatar}
										alt={celebrant.name}
										className="h-full w-full rounded-full object-cover"
									/>
								) : (
									<div className="[&>svg]:h-8 [&>svg]:w-8">
										<Avvvatars value={celebrant.name} style="shape" size={32} />
									</div>
								)}
							</div>
						))}
						{remainingCount > 0 && (
							<div className="bg-muted text-muted-foreground ring-border z-20 flex h-8 w-8 items-center justify-center rounded-full pl-1 text-xs font-bold ring-2">
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
