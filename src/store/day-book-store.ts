import { AVATAR_SETTINGS } from "@/constants/avatar-settings";
import { FLOATING_MESSAGES } from "@/constants/floating-messages";
import { GREETINGS } from "@/constants/greetings";
import { GREETING_TEXT_SETTINGS } from "@/constants/main-greeting";
import { SOUND_SETTINGS } from "@/constants/sounds-settings";
import type { Settings } from "@/types/settings";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const defaultSettings: Settings = {
	upcomingCount: 5,
	theme: "light",
	floatingMessages: FLOATING_MESSAGES,
	greetings: GREETINGS,
	avatarSettings: AVATAR_SETTINGS,
	soundSettings: SOUND_SETTINGS,
	animationsEnabled:
		typeof window !== "undefined"
			? !window.matchMedia("(prefers-reduced-motion: reduce)").matches
			: true,
	greetingTextSettings: GREETING_TEXT_SETTINGS,
	onboardingStatus: "not_started",
	onboardingStep: 0,
	quickActionsEnabled: true,
	quickActionsPosition: "bottom-right",
	quickActionsIsOpen: false,
};

interface DayBookState {
	settings: Settings;
	updateSettings: (settings: Partial<Settings>) => void;
}

const getInitialSettings = (): Settings => {
	try {
		const saved = localStorage.getItem("daybook_settings");
		if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
	} catch (e) {
		console.error(e);
	}
	return defaultSettings;
};

export const useDayBookStore = create<DayBookState>()(
	persist(
		(set) => ({
			settings: getInitialSettings(),

			updateSettings: (newSettings) =>
				set((state) => ({
					settings: { ...state.settings, ...newSettings },
				})),
		}),
		{
			name: "daybook-storage",
			partialize: (state) => ({ settings: state.settings }), // Only persist settings
			merge: (persistedState: unknown, currentState) => {
				const state = persistedState as Partial<DayBookState>;

				return {
					...currentState,
					...state,
					settings: {
						...defaultSettings,
						...(state?.settings || {}),
						upcomingCount: Math.max(
							1,
							Math.min(10, state?.settings?.upcomingCount ?? defaultSettings.upcomingCount),
						),
						avatarSettings: {
							...defaultSettings.avatarSettings,
							...(state?.settings?.avatarSettings || {}),
						},
						soundSettings: {
							...defaultSettings.soundSettings,
							...(state?.settings?.soundSettings || {}),
							mappings: {
								...defaultSettings.soundSettings?.mappings,
								...(state?.settings?.soundSettings?.mappings || {}),
							},
						},
						greetingTextSettings: {
							...defaultSettings.greetingTextSettings,
							...(state?.settings?.greetingTextSettings || {}),
							gradient: {
								...defaultSettings.greetingTextSettings?.gradient,
								...(state?.settings?.greetingTextSettings?.gradient || {}),
							},
						},
						onboardingStatus: state?.settings?.onboardingStatus ?? defaultSettings.onboardingStatus,
						onboardingStep: state?.settings?.onboardingStep ?? defaultSettings.onboardingStep,
						quickActionsEnabled:
							state?.settings?.quickActionsEnabled ?? defaultSettings.quickActionsEnabled,
						quickActionsPosition:
							state?.settings?.quickActionsPosition &&
							["top-left", "top-right", "bottom-left", "bottom-right"].includes(
								state.settings.quickActionsPosition,
							)
								? state.settings.quickActionsPosition
								: defaultSettings.quickActionsPosition,
					},
				} as DayBookState;
			},
		},
	),
);
