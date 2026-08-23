import { APP_INFO } from "@/constants/app-info";
import { useDayBookStore } from "@/store/day-book-store";
import { gooeyToast } from "goey-toast";
import { useEffect } from "react";

export function OnboardingHint() {
	const { settings, updateSettings } = useDayBookStore();
	const isVisible = settings.onboardingStatus === "not_started";

	useEffect(() => {
		if (isVisible) {
			let isUnmounting = false;
			const toastId = gooeyToast.info(`Welcome to ${APP_INFO.name}!`, {
				description: "Want a quick tour to see how everything works?",
				duration: Infinity,
				timing: { displayDuration: 86400000 },
				showTimestamp: false,
				classNames: {
					content: "items-center text-center",
					title: "text-center w-full",
				},
				action: {
					label: "Take a Tour",
					onClick: () => {
						updateSettings({ onboardingStatus: "in_progress", onboardingStep: 0 });
					},
				},
				onDismiss: () => {
					if (!isUnmounting) {
						updateSettings({ onboardingStatus: "dismissed" });
					}
				},
			});

			return () => {
				isUnmounting = true;
				gooeyToast.dismiss(toastId);
			};
		}
	}, [isVisible, updateSettings]);

	return null;
}
