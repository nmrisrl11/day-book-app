import { AnimatedLogo } from "@/components/icons/animated-logo";
import { Button } from "@/components/ui/button";
import { useDayBookStore } from "@/store/day-book-store";
import { addDays, isAfter, parseISO } from "date-fns";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface BackupReminderBannerProps {
	birthdaysCount: number;
}

export function BackupReminderBanner({ birthdaysCount }: BackupReminderBannerProps) {
	const { settings, updateSettings } = useDayBookStore();
	const navigate = useNavigate();
	const [shouldShow, setShouldShow] = useState(false);

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		const checkVisibility = () => {
			// Only consider showing if they have meaningful data (at least 5 records)
			if (birthdaysCount < 5) {
				setShouldShow(false);
				return;
			}

			// Don't show if the welcome tour or hint is currently active
			if (
				settings.onboardingStatus === "not_started" ||
				settings.onboardingStatus === "in_progress"
			) {
				setShouldShow(false);
				return;
			}

			const now = new Date();
			let nextDeadline: Date | null = null;

			// Check when it was last dismissed
			if (settings.lastBackupReminderDismissedAt) {
				const dismissedDate = parseISO(settings.lastBackupReminderDismissedAt);
				const deadline = addDays(dismissedDate, 30);
				if (isAfter(deadline, now)) {
					nextDeadline = deadline;
				}
			}

			// Check when the last backup was
			if (settings.lastBackupDate) {
				const backupDate = parseISO(settings.lastBackupDate);
				const deadline = addDays(backupDate, 30);
				if (isAfter(deadline, now)) {
					// The effective deadline is the later of the two
					if (!nextDeadline || isAfter(deadline, nextDeadline)) {
						nextDeadline = deadline;
					}
				}
			}

			if (nextDeadline) {
				setShouldShow(false);
				const timeRemaining = nextDeadline.getTime() - now.getTime();
				// Max setTimeout is ~24.8 days (2147483647 ms)
				const delay = Math.min(timeRemaining, 2147483647);
				timeoutId = setTimeout(checkVisibility, delay);
				return;
			}

			// If we reach here, it means:
			// 1. > 5 birthdays
			// 2. Either never backed up, or backed up > 30 days ago
			// 3. Either never dismissed, or dismissed > 30 days ago
			setShouldShow(true);
		};

		checkVisibility();

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [
		birthdaysCount,
		settings.lastBackupDate,
		settings.lastBackupReminderDismissedAt,
		settings.onboardingStatus,
	]);

	const handleDismiss = () => {
		setShouldShow(false);
		updateSettings({ lastBackupReminderDismissedAt: new Date().toISOString() });
	};

	const handleBackupNow = () => {
		navigate("/settings?tab=data");
	};

	if (!shouldShow) return null;

	return (
		<div className="fixed bottom-(--banner-mobile-offset) left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 animate-in flex-col items-center gap-4 rounded-3xl border border-dashed bg-background/95 px-6 py-5 text-center shadow-2xl ring-1 ring-border backdrop-blur-md fade-in slide-in-from-bottom-8 sm:flex-row sm:text-left md:bottom-6">
			<Button
				variant="ghost"
				size="icon"
				className="absolute top-2 right-2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
				onClick={handleDismiss}
				aria-label="Dismiss backup reminder"
			>
				<XIcon className="h-4 w-4" />
			</Button>

			<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
				<AnimatedLogo variant="backup" className="text-blue-600" autoPlay />
			</div>

			<div className="flex flex-1 flex-col gap-1">
				<h3 className="text-base font-semibold tracking-tight">Keep Your Memories Safe!</h3>
				<p className="text-sm text-muted-foreground">
					It looks like it's been a while since your last backup. Your data is stored locally on
					this device.
				</p>
			</div>

			<div className="mt-2 flex w-full flex-col gap-2 sm:mt-0 sm:w-auto sm:flex-row">
				<Button
					onClick={handleBackupNow}
					size="sm"
					className="w-full rounded-full font-medium sm:w-auto"
				>
					Backup Now
				</Button>
			</div>
		</div>
	);
}
