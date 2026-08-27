import { useEffect, useState } from "react";

/**
 * A centralized hook to get the current date.
 * Acts as the single source of truth for date-based calculations across the app.
 * Automatically updates at midnight local time to ensure it's always accurate.
 */
export function useCurrentDate() {
	const [currentDate, setCurrentDate] = useState(() => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	});

	useEffect(() => {
		const now = new Date();
		const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		const msUntilMidnight = tomorrow.getTime() - now.getTime();

		const timeout = setTimeout(() => {
			const next = new Date();
			setCurrentDate(new Date(next.getFullYear(), next.getMonth(), next.getDate()));
		}, msUntilMidnight);

		return () => clearTimeout(timeout);
	}, [currentDate]);

	return currentDate;
}
