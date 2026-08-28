import type { Birthday } from "@/types/birthday";
import type {
	DateClickInfo,
	DatesSetInfo,
	EventClickInfo,
	EventDisplayInfo,
} from "@fullcalendar/react";
import { lazy, Suspense, useState } from "react";
import { useBirthdayCalendar } from "../hooks/use-birthday-calendar";
import { BirthdayCalendarEvent } from "./birthday-calendar-event";
import { EventCalendar } from "./event-calendar";

const BirthdayDateCelebrantsDialog = lazy(() =>
	import("./birthday-date-celebrants-dialog").then((m) => ({
		default: m.BirthdayDateCelebrantsDialog,
	})),
);

export function BirthdayCalendar() {
	const { events, currentDate, setViewRange } = useBirthdayCalendar();
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedCelebrants, setSelectedCelebrants] = useState<Birthday[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleDateClick = (arg: DateClickInfo) => {
		// Find events on this date
		const dateEvents = events.filter((e) => e.date === arg.dateStr);
		if (dateEvents.length > 0) {
			const celebrants = dateEvents[0].extendedProps.celebrants as Birthday[];
			setSelectedDate(arg.date);
			setSelectedCelebrants(celebrants);
			setIsDialogOpen(true);
		}
	};

	const handleEventClick = (arg: EventClickInfo) => {
		const celebrants = arg.event.extendedProps.celebrants as Birthday[];
		if (arg.event.start && celebrants) {
			setSelectedDate(arg.event.start);
			setSelectedCelebrants(celebrants);
			setIsDialogOpen(true);
		}
	};

	const handleDatesSet = (arg: DatesSetInfo) => {
		setViewRange((prev: { start: Date; end: Date }) => {
			if (
				prev.start.getTime() === arg.view.currentStart.getTime() &&
				prev.end.getTime() === arg.view.currentEnd.getTime()
			) {
				return prev;
			}
			return { start: arg.view.currentStart, end: arg.view.currentEnd };
		});
	};

	return (
		<div className="w-full">
			<EventCalendar
				className="w-full"
				availableViews={["dayGridMonth"]}
				events={events}
				eventContent={(arg: EventDisplayInfo) => <BirthdayCalendarEvent {...arg} />}
				dateClick={handleDateClick}
				eventClick={handleEventClick}
				datesSet={handleDatesSet}
				eventInteractive={true}
				// Add cell hover and pointer cursor when it has events
				dayCellClass={(arg: { date: Date }) => {
					const localDateStr = `${arg.date.getFullYear()}-${String(arg.date.getMonth() + 1).padStart(2, "0")}-${String(arg.date.getDate()).padStart(2, "0")}`;
					const hasEvents = events.some((e) => e.date === localDateStr);
					return hasEvents ? "cursor-pointer hover:bg-muted/50 transition-colors" : "";
				}}
				// Ensure events are completely transparent and center their contents
				eventClass="!bg-transparent !border-none !shadow-none pointer-events-none"
				// Basic config
				fixedWeekCount={false}
				showNonCurrentDates={false}
				dayHeaderFormat={{ weekday: "short" }} // Fix misalignment on mobile by keeping it concise
				validRange={{ start: "1900-01-01", end: "2100-12-31" }}
			/>

			<Suspense fallback={null}>
				{isDialogOpen && (
					<BirthdayDateCelebrantsDialog
						isOpen={isDialogOpen}
						onClose={() => setIsDialogOpen(false)}
						date={selectedDate}
						celebrants={selectedCelebrants}
						currentDate={currentDate}
					/>
				)}
			</Suspense>
		</div>
	);
}
