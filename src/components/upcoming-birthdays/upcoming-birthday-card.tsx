import { calculateAge, formatBirthdayDisplay } from "@/helpers/birthday-utils";
import type { Birthday } from "@/types/birthday";
import Avvvatars from "avvvatars-react";
import { Badge } from "../ui/badge";

interface UpcomingBirthdayCardProps {
	celebrant: Birthday;
	currentDate: Date;
}

export function UpcomingBirthdayCard({ celebrant, currentDate }: UpcomingBirthdayCardProps) {
	const age = calculateAge(celebrant.birthday, currentDate);
	const formattedDate = formatBirthdayDisplay(celebrant.birthday);

	return (
		<div className="flex min-w-40 snap-center flex-col items-center rounded-3xl border border-border bg-card p-6 shadow-sm md:min-w-45">
			<div className="relative -mt-12 mb-4 rounded-full bg-background p-1 shadow-sm ring-1 ring-border">
				{celebrant.avatar ? (
					<img
						draggable={false}
						src={celebrant.avatar}
						alt={celebrant.name}
						className="h-16 w-16 rounded-full object-cover md:h-20 md:w-20"
					/>
				) : (
					<div className="[&>svg]:h-16 [&>svg]:w-16 md:[&>svg]:h-20 md:[&>svg]:w-20">
						<Avvvatars value={celebrant.name} style="shape" size={80} />
					</div>
				)}
			</div>

			<div className="flex w-full flex-col items-center gap-1 text-center">
				<h3 className="line-clamp-1 text-lg leading-tight font-bold text-foreground">
					{celebrant.name}
				</h3>
				<span className="text-sm font-medium text-muted-foreground">
					{formattedDate}
				</span>

				{age !== null && (
					<Badge variant="secondary" className="mt-1 px-2 py-0.5 font-semibold text-muted-foreground">{age} years old</Badge>
				)}
			</div>
		</div>
	);
}
