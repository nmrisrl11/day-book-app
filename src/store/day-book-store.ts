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
	customGreetingsEnabled: false,
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
		if (typeof window !== "undefined" && window.localStorage) {
			const saved = localStorage.getItem("daybook_settings");
			if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
		}
	} catch (e) {
		console.error(e);
	}
	return defaultSettings;
};

function isObject(item: unknown): boolean {
	return Boolean(item && typeof item === "object" && !Array.isArray(item));
}

function deepMerge<T>(target: any, source: any): T {
	if (!isObject(target) || !isObject(source)) {
		return source === undefined ? target : source;
	}

	const output = { ...target };
	Object.keys(source).forEach((key) => {
		if (isObject(source[key])) {
			if (!(key in target)) Object.assign(output, { [key]: source[key] });
			else output[key] = deepMerge(target[key], source[key]);
		} else {
			Object.assign(output, { [key]: source[key] });
		}
	});
	return output as T;
}

export const mergeState = (persistedState: unknown, currentState: DayBookState) => {
	const state = persistedState as Partial<DayBookState>;
	const safeSettings = isObject(state?.settings) ? state.settings : {};
	const mergedSettings = deepMerge<Settings>(defaultSettings, safeSettings);

	// Apply necessary constraints/clamping after the deep merge
	mergedSettings.upcomingCount = Math.max(1, Math.min(10, mergedSettings.upcomingCount));

	const validPositions = ["top-left", "top-right", "bottom-left", "bottom-right"];
	if (
		!mergedSettings.quickActionsPosition ||
		!validPositions.includes(mergedSettings.quickActionsPosition as string)
	) {
		mergedSettings.quickActionsPosition = defaultSettings.quickActionsPosition;
	}

	return {
		...currentState,
		...state,
		settings: mergedSettings,
	} as DayBookState;
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
			merge: mergeState,
		},
	),
);
