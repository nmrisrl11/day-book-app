import { AnimatedLogo } from "@/components/icons/animated-logo";
import { Button } from "@/components/ui/button";
import { useDayBookStore } from "@/store/day-book-store";
import { differenceInDays, parseISO } from "date-fns";
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

		// Check when it was last dismissed
		if (settings.lastBackupReminderDismissedAt) {
			const dismissedDate = parseISO(settings.lastBackupReminderDismissedAt);
			if (differenceInDays(now, dismissedDate) < 30) {
				setShouldShow(false);
				return;
			}
		}

		// Check when the last backup was
		if (settings.lastBackupDate) {
			const backupDate = parseISO(settings.lastBackupDate);
			if (differenceInDays(now, backupDate) < 30) {
				setShouldShow(false);
				return;
			}
		}

		// If we reach here, it means:
		// 1. > 5 birthdays
		// 2. Either never backed up, or backed up > 30 days ago
		// 3. Either never dismissed, or dismissed > 30 days ago
		setShouldShow(true);
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
		<div className="bg-background/95 fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 animate-in fade-in slide-in-from-bottom-8 flex-col items-center gap-4 rounded-3xl border border-dashed px-6 py-5 text-center shadow-2xl backdrop-blur-md sm:flex-row sm:text-left mb-[env(safe-area-inset-bottom)] ring-1 ring-border">
			<Button
				variant="ghost"
				size="icon"
				className="text-muted-foreground hover:text-foreground absolute top-2 right-2 h-8 w-8 rounded-full"
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
				<p className="text-muted-foreground text-sm">
					It looks like it's been a while since your last backup. Your data is stored locally on
					this device.
				</p>
			</div>

			<div className="mt-2 flex w-full flex-col gap-2 sm:mt-0 sm:w-auto sm:flex-row">
				<Button
					onClick={handleBackupNow}
					size="sm"
					className="w-full sm:w-auto rounded-full font-medium"
				>
					Backup Now
				</Button>
			</div>
		</div>
	);
}
