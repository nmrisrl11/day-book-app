import { calculateAge, formatBirthdayDisplay } from "@/helpers/birthday-utils";
import type { Birthday } from "@/types/birthday";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "../ui/badge";

interface UpcomingBirthdayCardProps {
	celebrant: Birthday;
	currentDate: Date;
}

export function UpcomingBirthdayCard({ celebrant, currentDate }: UpcomingBirthdayCardProps) {
	const age = calculateAge(celebrant.birthday, currentDate);
	const formattedDate = formatBirthdayDisplay(celebrant.birthday);

	return (
		<div className="border-border bg-card flex min-w-40 snap-center flex-col items-center rounded-3xl border p-6 shadow-sm md:min-w-45">
			<div className="bg-background ring-border relative -mt-12 mb-4 rounded-full p-1 shadow-sm ring-1">
				<UserAvatar birthday={celebrant} size={80} className="h-16 w-16 md:h-20 md:w-20" />
			</div>

			<div className="flex w-full flex-col items-center gap-1 text-center">
				<h3 className="text-foreground line-clamp-1 text-lg leading-tight font-bold">
					{celebrant.name}
				</h3>
				<span className="text-muted-foreground text-sm font-medium">{formattedDate}</span>

				{age !== null && (
					<Badge
						variant="secondary"
						className="text-muted-foreground mt-1 px-2 py-0.5 font-semibold"
					>
						{age} years old
					</Badge>
				)}
			</div>
		</div>
	);
}
