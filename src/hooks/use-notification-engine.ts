import { APP_INFO } from "@/constants/app-info";
import { calculateDaysUntilBirthday } from "@/helpers/birthday-utils";
import { db, type NotificationRecord } from "@/lib/db";
import { useDayBookStore } from "@/store/day-book-store";
import { format } from "date-fns";
import { useEffect } from "react";
import { useCurrentDate } from "./use-current-date";

export function useNotificationEngine() {
	const currentDate = useCurrentDate();
	const settings = useDayBookStore((state) => state.settings.notificationSettings);

	useEffect(() => {
		if (!settings?.enabled || !Array.isArray(settings.remindDaysBefore)) return;

		const checkBirthdays = async () => {
			const birthdays = await db.birthdays.toArray();
			const todayStr = format(currentDate, "yyyy-MM-dd");

			for (const b of birthdays) {
				const daysUntil = calculateDaysUntilBirthday(b.birthday, currentDate);

				if (settings.remindDaysBefore.includes(daysUntil)) {
					const notifId = `notif-${b.id}-${todayStr}-${daysUntil}`;

					let message = "";
					let type: "today" | "upcoming" = "upcoming";
					if (daysUntil === 0) {
						message = `It's ${b.name}'s birthday today!`;
						type = "today";
					} else if (daysUntil === 1) {
						message = `${b.name}'s birthday is tomorrow!`;
					} else {
						message = `${b.name}'s birthday is in ${daysUntil} days.`;
					}

					const newNotification: NotificationRecord = {
						id: notifId,
						personId: b.id,
						type,
						message,
						read: false,
						createdAt: Date.now(),
						date: todayStr,
					};

					try {
						await db.notifications.add(newNotification);

						// Trigger system notification if permitted and successfully added to DB
						if ("Notification" in window && Notification.permission === "granted") {
							const notificationData = {
								body: message,
								icon: "/web-app-manifest-192x192.png",
								data: { url: `${window.location.origin}/person/${b.id}` },
							};

							if ("serviceWorker" in navigator) {
								const registration = await navigator.serviceWorker.ready;
								registration.showNotification(
									`${APP_INFO.name} Reminder \uD83C\uDF82`,
									notificationData,
								);
							} else {
								const notif = new Notification(
									`${APP_INFO.name} Reminder \uD83C\uDF82`,
									notificationData,
								);
								notif.onclick = () => {
									window.focus();
									notif.close();
								};
							}
						}
					} catch {
						// ConstraintError: Notification with this deterministic ID already exists.
						// Safely ignore to prevent duplicate notifications.
					}
				}
			}
		};

		checkBirthdays();
	}, [currentDate, settings]);
}
