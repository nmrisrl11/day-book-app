import { useBirthdayData } from "@/hooks";
import type { Birthday } from "@/types/birthday";
import { useMemo, useState } from "react";
import { generateBirthdayEvents } from "../utils/birthday-calendar-events";

export function useBirthdayCalendar(previewBirthdays?: Birthday[]) {
	const data = useBirthdayData();
	const birthdays = previewBirthdays ?? data.birthdays;
	const isLoading = previewBirthdays ? false : data.isLoading;
	const currentDate = data.currentDate;

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
