import { APP_INFO } from "@/constants/app-info";
import { changelog } from "@/data/changelog";
import { calculateDaysUntilBirthday } from "@/helpers/birthday-utils";
import { db, type NotificationRecord } from "@/lib/db";
import { useDayBookStore } from "@/store/day-book-store";
import { format } from "date-fns";
import { useEffect } from "react";
import { useCurrentDate } from "./use-current-date";

async function showOSNotification(title: string, options: NotificationOptions) {
	if (!("Notification" in window) || Notification.permission !== "granted") return;

	if ("serviceWorker" in navigator) {
		try {
			const registration = await navigator.serviceWorker.getRegistration();
			if (registration && registration.active) {
				await registration.showNotification(title, options);
				return;
			}
		} catch (err) {
			console.error("Service Worker notification error", err);
		}
	}

	// Fallback for development or when SW is not active
	const notif = new Notification(title, options);
	notif.onclick = () => {
		if (options.data?.url) {
			window.location.href = options.data.url;
		}
		window.focus();
		notif.close();
	};
}

export function useNotificationEngine() {
	const currentDate = useCurrentDate();
	const notificationSettings = useDayBookStore((state) => state.settings.notificationSettings);
	const globalSettings = useDayBookStore((state) => state.settings);
	const updateSettings = useDayBookStore((state) => state.updateSettings);

	useEffect(() => {
		// --- System Update Check ---
		const currentVersion = changelog[0]?.version;
		if (currentVersion) {
			if (globalSettings.onboardingStatus === "not_started") {
				// Fresh install: just silently update the version
				if (globalSettings.lastSeenVersion !== currentVersion) {
					updateSettings({ lastSeenVersion: currentVersion });
				}
			} else if (globalSettings.lastSeenVersion !== currentVersion) {
				const todayStr = format(currentDate, "yyyy-MM-dd");
				const notifId = `notif-system-update-${currentVersion}`;
				const message = `Update v${currentVersion} Released! Click to see what's new.`;

				const newNotification: NotificationRecord = {
					id: notifId,
					personId: "system",
					type: "system",
					message,
					read: false,
					createdAt: Date.now(),
					date: todayStr,
				};

				db.notifications
					.add(newNotification)
					.then(() => {
						// Existing user updated: add notification and update version
						updateSettings({ lastSeenVersion: currentVersion });
						showOSNotification(`${APP_INFO.name} Update \uD83D\uDE80`, {
							body: message,
							icon: "/web-app-manifest-192x192.png",
							data: { url: `${window.location.origin}/about#whats-new` },
						});
					})
					.catch((err) => {
						if (err.name === "ConstraintError") {
							// Ignore duplicate insert errors, but still update the version flag
							// in case the DB insert succeeded previously but settings failed to save.
							updateSettings({ lastSeenVersion: currentVersion });
						} else {
							console.error("Failed to add update notification:", err);
						}
					});
			}
		}

		// --- Birthday Reminders Check ---
		if (!notificationSettings?.enabled || !Array.isArray(notificationSettings.remindDaysBefore))
			return;

		const checkBirthdays = async () => {
			const birthdays = await db.birthdays.toArray();
			const todayStr = format(currentDate, "yyyy-MM-dd");

			for (const b of birthdays) {
				const daysUntil = calculateDaysUntilBirthday(b.birthday, currentDate);

				if (notificationSettings.remindDaysBefore.includes(daysUntil)) {
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
						showOSNotification(`${APP_INFO.name} Reminder \uD83C\uDF82`, {
							body: message,
							icon: "/web-app-manifest-192x192.png",
							data: { url: `${window.location.origin}/person/${b.id}` },
						});
					} catch {
						// ConstraintError: Notification with this deterministic ID already exists.
						// Safely ignore to prevent duplicate notifications.
					}
				}
			}
		};

		checkBirthdays();
	}, [
		currentDate,
		notificationSettings?.enabled,
		notificationSettings?.remindDaysBefore,
		globalSettings.onboardingStatus,
		globalSettings.lastSeenVersion,
		updateSettings,
	]);
}
