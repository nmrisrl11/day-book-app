import { cn } from "@/lib/utils";
import { type CalendarOptions, useCalendarController } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import { XIcon } from "lucide-react";
import { EventCalendarToolbar } from "./event-calendar-toolbar";
import { EventCalendarViews } from "./event-calendar-views";

const plugins = [dayGridPlugin, interactionPlugin];
const defaultAvailableViews = ["dayGridMonth"];
const navLinkDayClick = undefined;
const navLinkWeekClick = undefined;

export interface EventCalendarProps extends Omit<
	CalendarOptions,
	"class" | "className" | "headerToolbar" | "footerToolbar"
> {
	className?: string;
	availableViews?: string[];
	addButton?: {
		isPrimary?: boolean;
		text?: string;
		hint?: string;
		click?: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	};
}

export function EventCalendar({
	availableViews = defaultAvailableViews,
	addButton,
	className,
	height,
	contentHeight,
	direction,
	plugins: userPlugins = [],
	...restOptions
}: EventCalendarProps) {
	const controller = useCalendarController();

	const hasBorderX = !(restOptions.borderlessX ?? restOptions.borderless);
	const hasBorderTop = !(restOptions.borderlessTop ?? restOptions.borderless);
	const hasBorderBottom = !(restOptions.borderlessBottom ?? restOptions.borderless);
	const isHeightAuto = height === "auto" || contentHeight === "auto";

	return (
		<div
			className={cn(
				className,
				"bg-background flex flex-col",
				hasBorderX && "border-x",
				hasBorderTop && "border-t",
				hasBorderBottom && "border-b",
				hasBorderTop && hasBorderX && "rounded-t-lg",
				hasBorderBottom && hasBorderX && "rounded-b-lg",
				!isHeightAuto && "overflow-hidden",
			)}
			dir={direction === "rtl" ? "rtl" : undefined}
		>
			<EventCalendarToolbar
				className="p-4"
				controller={controller}
				availableViews={availableViews}
				addButton={addButton}
			/>
			<div className="min-h-0 grow">
				<EventCalendarViews
					controller={controller}
					height={isHeightAuto ? "auto" : height !== undefined ? "100%" : contentHeight}
					initialView={availableViews[0]}
					navLinkDayClick={navLinkDayClick}
					navLinkWeekClick={navLinkWeekClick}
					plugins={[...plugins, ...userPlugins]}
					popoverCloseContent={() => <XIcon className="h-4 w-4" />}
					{...restOptions}
				/>
			</div>
		</div>
	);
}
