import { AnimatedLogo } from "@/components/icons/animated-logo";
import { Button } from "@/components/ui/button";
import { useInstallApp } from "@/hooks/use-install-app";
import { useDayBookStore } from "@/store/day-book-store";
import { addDays, isAfter, parseISO } from "date-fns";
import { DownloadIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface InstallAppBannerProps {
	birthdaysCount: number;
	onVisibilityChange?: (visible: boolean) => void;
}

export function InstallAppBanner({ birthdaysCount, onVisibilityChange }: InstallAppBannerProps) {
	const { settings, updateSettings } = useDayBookStore();
	const navigate = useNavigate();
	const [shouldShow, setShouldShow] = useState(false);
	const { isInstallable, isInstalled, isIOS, isDesktop, isChecking, promptInstall } =
		useInstallApp();

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		const checkVisibility = () => {
			if (isChecking || isInstalled) {
				setShouldShow(false);
				return;
			}

			// Only show if the user has experienced value: completed onboarding OR added a birthday
			const hasExperiencedValue = settings.onboardingStatus === "completed" || birthdaysCount > 0;

			if (!hasExperiencedValue) {
				setShouldShow(false);
				return;
			}

			// Only show if it's installable natively, OR we can show them how (iOS/Desktop)
			const canInstall = isInstallable || isIOS || isDesktop;
			if (!canInstall) {
				setShouldShow(false);
				return;
			}

			// Don't show if the welcome tour is currently active
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
			if (settings.lastInstallPromptDismissedAt) {
				const dismissedDate = parseISO(settings.lastInstallPromptDismissedAt);
				const deadline = addDays(dismissedDate, 30);
				if (isAfter(deadline, now)) {
					nextDeadline = deadline;
				}
			}

			if (nextDeadline) {
				setShouldShow(false);
				const timeRemaining = nextDeadline.getTime() - now.getTime();
				const delay = Math.min(timeRemaining, 2147483647);
				timeoutId = setTimeout(checkVisibility, delay);
				return;
			}

			setShouldShow(true);
		};

		checkVisibility();

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [
		isChecking,
		isInstalled,
		isInstallable,
		isIOS,
		isDesktop,
		settings.onboardingStatus,
		birthdaysCount,
		settings.lastInstallPromptDismissedAt,
	]);

	// Notify parent of visibility changes to prevent clashes
	useEffect(() => {
		onVisibilityChange?.(shouldShow);
	}, [shouldShow, onVisibilityChange]);

	const handleDismiss = () => {
		setShouldShow(false);
		updateSettings({ lastInstallPromptDismissedAt: new Date().toISOString() });
	};

	const handleInstallClick = () => {
		if (isInstallable) {
			promptInstall();
		} else {
			// If iOS or Desktop but no native prompt, redirect to the install instructions page
			navigate("/install");
		}
	};

	if (!shouldShow) return null;

	return (
		<div className="bg-background/95 ring-border fixed bottom-6 left-1/2 z-50 mb-[env(safe-area-inset-bottom)] flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 animate-in flex-col items-center gap-4 rounded-3xl border border-dashed px-6 py-5 text-center shadow-2xl backdrop-blur-md fade-in slide-in-from-bottom-8 sm:flex-row sm:text-left ring-1">
			<Button
				variant="ghost"
				size="icon"
				className="text-muted-foreground hover:text-foreground absolute top-2 right-2 h-8 w-8 rounded-full"
				onClick={handleDismiss}
				aria-label="Dismiss install reminder"
			>
				<XIcon className="h-4 w-4" />
			</Button>

			<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10">
				<AnimatedLogo variant="default" className="text-indigo-600" autoPlay />
			</div>

			<div className="flex flex-1 flex-col gap-1">
				<h3 className="text-base font-semibold tracking-tight">Get the Full Experience!</h3>
				<p className="text-muted-foreground text-sm">
					Install DayBook to your home screen for instant offline access and a seamless app-like
					feel.
				</p>
			</div>

			<div className="mt-2 flex w-full flex-col gap-2 sm:mt-0 sm:w-auto sm:flex-row">
				<Button
					onClick={handleInstallClick}
					size="sm"
					className="w-full rounded-full font-medium sm:w-auto"
				>
					<DownloadIcon className="mr-2 h-4 w-4" />
					Install App
				</Button>
			</div>
		</div>
	);
}
