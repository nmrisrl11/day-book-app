import { useDragScroll } from "@/hooks/use-drag-scroll";
import type { Birthday } from "@/types/birthday";
import { UpcomingBirthdayCard } from "./upcoming-birthday-card";

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
		<div className="flex w-full flex-col gap-6">
			<h2 className="text-foreground px-2 text-xl font-bold tracking-tight uppercase md:text-2xl">
				Upcoming
			</h2>

			<div className="w-full scrollbar-none overflow-x-auto rounded-xl mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] whitespace-nowrap [&::-webkit-scrollbar]:hidden">
				<div
					className={`flex w-max snap-x snap-mandatory space-x-4 p-4 pt-10 pb-6 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
					{...handlers}
				>
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
	);
}
