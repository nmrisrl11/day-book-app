import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/user-avatar";
import {
	calculateAge,
	calculateDaysUntilBirthday,
	formatBirthdayDisplay,
} from "@/helpers/birthday-utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Birthday } from "@/types/birthday";

interface UpcomingBirthdayCardProps {
	celebrant: Birthday;
	currentDate: Date;
}

export function UpcomingBirthdayCard({ celebrant, currentDate }: UpcomingBirthdayCardProps) {
	const age = calculateAge(celebrant.birthday, currentDate);
	const formattedDate = formatBirthdayDisplay(celebrant.birthday);
	const daysUntil = calculateDaysUntilBirthday(celebrant.birthday, currentDate);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return (
		<div className="flex min-w-40 snap-center flex-col items-center rounded-3xl border border-border bg-card p-6 shadow-sm md:min-w-45">
			<div className="relative -mt-12 mb-4 rounded-full bg-background p-1 shadow-sm ring-1 ring-border">
				<UserAvatar
					birthday={celebrant}
					size={isDesktop ? 80 : 64}
					className="h-16 w-16 md:h-20 md:w-20"
				/>
			</div>

			<div className="flex w-full flex-col items-center gap-1 text-center">
				<h3 className="line-clamp-1 text-lg leading-tight font-bold text-foreground">
					{celebrant.name}
				</h3>
				<span className="text-sm font-medium text-muted-foreground">{formattedDate}</span>

				<div className="mt-1 flex flex-wrap justify-center gap-1">
					{daysUntil === 0 ? (
						<Badge variant="default" className="px-2 py-0.5 font-semibold">
							Today{age !== null ? `, now ${age}` : ""}
						</Badge>
					) : (
						<Badge variant="secondary" className="px-2 py-0.5 font-semibold">
							{age !== null
								? `Turning ${age + 1} ${daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`}`
								: `${daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}`}
						</Badge>
					)}
				</div>
			</div>
		</div>
	);
}
