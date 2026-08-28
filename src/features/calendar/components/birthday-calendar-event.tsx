import { UserAvatar } from "@/components/user-avatar";
import type { Birthday } from "@/types/birthday";
import type { EventDisplayInfo } from "@fullcalendar/react";

export function BirthdayCalendarEvent({ event }: EventDisplayInfo) {
	const celebrants = event.extendedProps.celebrants as Birthday[];
	if (!celebrants || celebrants.length === 0) return null;

	const maxAvatars = 3;
	const visibleCelebrants = celebrants.slice(0, maxAvatars);
	const overflowCount = celebrants.length - maxAvatars;

	return (
		<div className="flex w-full items-center justify-center -space-x-1 overflow-hidden p-0.5 sm:-space-x-1.5">
			{visibleCelebrants.map((person, index) => (
				<div
					key={person.id}
					className={`bg-background ring-border relative rounded-full ring-2 ${index >= 1 ? "hidden sm:block" : "block"}`}
				>
					<UserAvatar birthday={person} size={24} className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
				</div>
			))}

			{celebrants.length > 1 && (
				<div className="text-foreground bg-muted ring-border z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] leading-none font-bold ring-2 sm:hidden">
					+{celebrants.length - 1}
				</div>
			)}

			{overflowCount > 0 && (
				<div className="text-foreground bg-muted ring-border z-10 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] leading-none font-bold ring-2 sm:flex lg:h-7 lg:w-7">
					+{overflowCount}
				</div>
			)}
		</div>
	);
}
