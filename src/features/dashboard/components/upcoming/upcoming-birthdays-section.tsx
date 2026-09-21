import { useDragScroll } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Birthday } from "@/types/birthday";
import { useNavigate } from "react-router-dom";
import { UpcomingBirthdayCard } from "./upcoming-birthday-card";

interface UpcomingBirthdaysSectionProps {
	upcomingBirthdays: Birthday[];
	currentDate: Date;
}

export function UpcomingBirthdaysSection({
	upcomingBirthdays,
	currentDate,
}: UpcomingBirthdaysSectionProps) {
	const { isDragging, hasDragged, handlers } = useDragScroll();
	const navigate = useNavigate();

	if (upcomingBirthdays.length === 0) return null;

	const displayedBirthdays = upcomingBirthdays.slice(0, 10);

	return (
		<div className="w-full max-w-5xl space-y-4 px-4 sm:px-6">
			<h2 className="px-2 text-xl font-bold tracking-tight text-foreground">Upcoming Birthdays</h2>

			<div className="relative w-full">
				<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-background to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background to-transparent" />

				<div
					className={cn(
						"scrollbar-none overflow-x-auto [&::-webkit-scrollbar]:hidden",
						isDragging ? "cursor-grabbing" : "cursor-grab",
					)}
				>
					<div
						className="flex w-max snap-x snap-mandatory space-x-4 p-4 pt-10 pb-6 select-none"
						{...handlers}
					>
						{displayedBirthdays.map((celebrant) => (
							<div
								key={celebrant.id}
								onClick={(e) => {
									if (hasDragged) {
										e.preventDefault();
										e.stopPropagation();
										return;
									}
									window.scrollTo(0, 0);
									navigate(`/person/${celebrant.id}`);
								}}
								className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
							>
								<UpcomingBirthdayCard celebrant={celebrant} currentDate={currentDate} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
