import type { Birthday } from "@/types/birthday";
import { useState } from "react";
import { UpcomingBirthdayCard } from "./upcoming-birthday-card";

interface UpcomingBirthdaysSectionProps {
	upcomingBirthdays: Birthday[];
	currentDate: Date;
}

export function UpcomingBirthdaysSection({
	upcomingBirthdays,
	currentDate,
}: UpcomingBirthdaysSectionProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	if (upcomingBirthdays.length === 0) return null;

	// Show at most 6 upcoming birthdays initially to match requirements
	const displayedBirthdays = upcomingBirthdays.slice(0, 10);

	const getScrollContainer = (element: HTMLElement) => {
		return element.parentElement as HTMLElement;
	};

	const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const container = getScrollContainer(e.currentTarget);
		if (!container) return;
		setIsDragging(true);
		setStartX(e.pageX - container.offsetLeft);
		setScrollLeft(container.scrollLeft);
	};

	const onMouseLeave = () => {
		setIsDragging(false);
	};

	const onMouseUp = () => {
		setIsDragging(false);
	};

	const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isDragging) return;
		const container = getScrollContainer(e.currentTarget);
		if (!container) return;
		e.preventDefault();
		const x = e.pageX - container.offsetLeft;
		const walk = (x - startX) * 2;
		container.scrollLeft = scrollLeft - walk;
	};

	return (
		<div className="flex w-full flex-col gap-6">
			<h2 className="text-foreground px-2 text-xl font-bold tracking-tight uppercase md:text-2xl">
				Upcoming
			</h2>

			<div className="w-full scrollbar-none overflow-x-auto rounded-xl mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] whitespace-nowrap [&::-webkit-scrollbar]:hidden">
				<div
					className={`flex w-max snap-x snap-mandatory space-x-4 p-4 pt-10 pb-6 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
					onMouseDown={onMouseDown}
					onMouseLeave={onMouseLeave}
					onMouseUp={onMouseUp}
					onMouseMove={onMouseMove}
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
