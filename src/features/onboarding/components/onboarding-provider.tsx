import { AnimatedLogo } from "@/components/icons/animated-logo";
import { APP_INFO } from "@/constants/app-info";
import { useDayBookStore } from "@/store/day-book-store";
import { useEffect, useState } from "react";
import type { EventData, Step } from "react-joyride";
import { EVENTS, Joyride, STATUS } from "react-joyride";
import { OnboardingHint } from "./onboarding-hint";

const TOUR_STEPS: Step[] = [
	{
		target: "body",
		placement: "center",
		title: `Welcome to ${APP_INFO.name}!`,
		content:
			"Your beautiful, local-first space to remember the people you love. Let's take a quick look around.",
		skipBeacon: true,
	},
	{
		target: "#global-search-trigger",
		placement: "bottom",
		title: "Global Search",
		content:
			"Press ⌘K or click here anytime to instantly search for people, pages, or settings across the app.",
		skipBeacon: true,
	},
	{
		target: "a[href='/manage']",
		placement: "bottom",
		title: "Your People",
		content:
			"Manage all your birthdays here. You can add, edit, and organize your friends and family.",
		skipBeacon: true,
	},
	{
		target: "a[href='/invitations']",
		placement: "bottom",
		title: "Birthday Links",
		content: "Generate secure invitation links to easily request birthdays from your friends.",
		skipBeacon: true,
	},
	{
		target: "a[href='/settings']",
		placement: "bottom",
		title: "Personalize & Backup",
		content:
			"Change themes, customize your avatars, configure sounds, and securely sync your devices here.",
		skipBeacon: true,
	},
	{
		target: "#quick-action-tab",
		placement: "left",
		title: "Quick Customizations",
		content:
			"Click this tab to instantly change how avatars and greetings appear on your dashboard.",
		skipBeacon: true,
	},
	{
		target: "body",
		placement: "center",
		title: "Privacy First",
		content: `${APP_INFO.name} is truly private. Your data stays securely on your device unless you choose to export or sync it.`,
		skipBeacon: true,
	},
	{
		target: "body",
		placement: "center",
		title: "You're all set!",
		content: <OnboardingFinalLogo />,
		skipBeacon: true,
	},
];

function OnboardingFinalLogo() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-4">
			<AnimatedLogo type="icon" autoPlay className="h-20 w-20" iconClassName="h-full w-full" />
			<p className="text-center font-medium">Enjoy remembering the people you love.</p>
		</div>
	);
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
	const { settings, updateSettings } = useDayBookStore();
	// Need to defer joyride mounting slightly to avoid SSR/hydration mismatches and ensure DOM is ready
	const [isMounted, setIsMounted] = useState(false);
	const isDark = settings.theme === "dark";

	// Use hardcoded colors instead of CSS variables because react-joyride doesn't parse hsl(var(--card)) correctly
	const joyrideColors = {
		primary: isDark ? "#fafafa" : "#09090b",
		primaryForeground: isDark ? "#09090b" : "#fafafa",
		foreground: isDark ? "#fafafa" : "#09090b",
		card: isDark ? "#09090b" : "#ffffff", // Matches Zinc 950 vs white
		overlay: isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.5)",
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const isRunning = settings.onboardingStatus === "in_progress";
	const stepIndex = settings.onboardingStep ?? 0;

	const handleJoyrideCallback = (data: EventData) => {
		const { action, index, status, type } = data;

		if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
			// Update step index
			const nextStepIndex = index + (action === "prev" ? -1 : 1);
			updateSettings({ onboardingStep: nextStepIndex });
		} else if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
			// Finish tour
			updateSettings({ onboardingStatus: "completed" });
		}
	};

	return (
		<>
			{isMounted && (
				<Joyride
					steps={TOUR_STEPS}
					run={isRunning}
					stepIndex={stepIndex}
					onEvent={handleJoyrideCallback}
					continuous
					locale={{ last: "Get Started" }}
					options={{
						showProgress: true,
						buttons: ["back", "close", "primary", "skip"],
						overlayClickAction: false,
						spotlightPadding: 4,
						zIndex: 10000,
						primaryColor: joyrideColors.primary,
						textColor: joyrideColors.foreground,
						backgroundColor: joyrideColors.card,
						arrowColor: joyrideColors.card,
						overlayColor: joyrideColors.overlay,
					}}
					styles={{
						tooltipContainer: {
							textAlign: "left",
						},
						buttonPrimary: {
							borderRadius: "calc(var(--radius) - 2px)",
							padding: "8px 16px",
							backgroundColor: joyrideColors.primary,
							color: joyrideColors.primaryForeground,
						},
						buttonBack: {
							marginRight: 8,
							color: "hsl(var(--muted-foreground))",
						},
						buttonSkip: {
							color: "hsl(var(--muted-foreground))",
						},
						tooltip: {
							borderRadius: "var(--radius)",
							padding: "20px",
							border: "1px solid hsl(var(--border))",
							boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
						},
						tooltipTitle: {
							fontSize: "1.25rem",
							fontWeight: 700,
							color: "hsl(var(--card-foreground))",
							marginBottom: "0.5rem",
						},
						tooltipContent: {
							color: "hsl(var(--muted-foreground))",
							lineHeight: "1.5",
						},
					}}
				/>
			)}
			<OnboardingHint />
			{children}
		</>
	);
}
