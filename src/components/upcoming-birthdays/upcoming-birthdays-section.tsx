import { useDragScroll } from "@/hooks/use-drag-scroll";
import type { Birthday } from "@/types/birthday";
import { UpcomingBirthdayCard } from "./upcoming-birthday-card";
import { cn } from "@/lib/utils";

interface UpcomingBirthdaysSectionProps {
	upcomingBirthdays: Birthday[];
	currentDate: Date;
}

export function UpcomingBirthdaysSection({
	upcomingBirthdays,
	currentDate,
}: UpcomingBirthdaysSectionProps) {
	const { isDragging, handlers } = useDragScroll();

	if (upcomingBirthdays.length === 0) return null;

	const displayedBirthdays = upcomingBirthdays.slice(0, 10);

	return (
		<div className="w-full max-w-5xl space-y-4 px-4 sm:px-6">
			<h2 className="text-foreground px-2 text-xl font-bold tracking-tight">Upcoming Birthdays</h2>

			<div className="relative w-full">
				<div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r to-transparent" />
				<div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l to-transparent" />

				<div
					className={cn(
						"overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden",
						isDragging ? "cursor-grabbing" : "cursor-grab",
					)}
					{...handlers}
				>
					<div className="flex w-max snap-x snap-mandatory space-x-4 p-4 pt-10 pb-6 select-none">
						{displayedBirthdays.map((celebrant) => (
							<UpcomingBirthdayCard
								key={celebrant.id}
								celebrant={celebrant}
								currentDate={currentDate}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
