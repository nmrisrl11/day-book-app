import { useBirthdayData } from "@/hooks/use-birthday-data";
import { useMemo, useState } from "react";
import { generateBirthdayEvents } from "../utils/birthday-calendar-events";

export function useBirthdayCalendar() {
	const { birthdays, isLoading, currentDate } = useBirthdayData();

	// Default to current year, but will update when calendar changes view
	const [viewRange, setViewRange] = useState<{ start: Date; end: Date }>({
		start: new Date(currentDate.getFullYear(), 0, 1),
		end: new Date(currentDate.getFullYear(), 11, 31),
	});

	const events = useMemo(() => {
		if (isLoading) return [];
		return generateBirthdayEvents(birthdays, viewRange.start, viewRange.end);
	}, [birthdays, viewRange, isLoading]);

	return {
		events,
		isLoading,
		currentDate,
		setViewRange,
	};
}
