import { BORING_AVATARS_DEFAULT_COLORS } from "@/constants/default-colors";
import { FLOATING_MESSAGES } from "@/constants/floating-messages";
import { GREETINGS } from "@/constants/greetings";
import { DEFAULT_GREETING_TEXT_SETTINGS } from "@/constants/main-greeting";
import type { Birthday } from "@/types/birthday";
import type { Settings } from "@/types/settings";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const defaultSettings: Settings = {
	upcomingCount: 5,
	theme: "light",
	floatingMessages: FLOATING_MESSAGES,
	greetings: GREETINGS,
	avatarSettings: {
		allowCustomUploads: true,
		defaultLibrary: "avvvatars",
		avvvatarsStyle: "shape",
		boringAvatarsVariant: "beam",
		boringAvatarsColors: BORING_AVATARS_DEFAULT_COLORS,
	},
	soundSettings: {
		enabled: true,
		volume: 0.5,
		mappings: {
			hover: "tick",
			press: "pulse",
			toggle: "toggle",
			success: "success",
			error: "error",
		},
	},
	animationsEnabled:
		typeof window !== "undefined"
			? !window.matchMedia("(prefers-reduced-motion: reduce)").matches
			: true,
	greetingTextSettings: DEFAULT_GREETING_TEXT_SETTINGS,
};

interface DayBookState {
	birthdays: Birthday[];
	settings: Settings;
	addBirthday: (birthday: Omit<Birthday, "id">) => void;
	editBirthday: (birthday: Birthday) => void;
	deleteBirthday: (id: string) => void;
	deleteAllBirthdays: () => void;
	updateSettings: (settings: Partial<Settings>) => void;
	importData: (data: Birthday[]) => void;
}

const getInitialBirthdays = (): Birthday[] => {
	try {
		const saved = localStorage.getItem("daybook_birthdays");
		if (saved) return JSON.parse(saved);
	} catch (e) {
		console.error(e);
	}
	return [];
};

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
			birthdays: getInitialBirthdays(),
			settings: getInitialSettings(),

			addBirthday: (birthday) =>
				set((state) => ({
					birthdays: [...state.birthdays, { ...birthday, id: crypto.randomUUID() }],
				})),

			editBirthday: (birthday) =>
				set((state) => ({
					birthdays: state.birthdays.map((b) => (b.id === birthday.id ? birthday : b)),
				})),

			deleteBirthday: (id) =>
				set((state) => ({
					birthdays: state.birthdays.filter((b) => b.id !== id),
				})),

			deleteAllBirthdays: () => set({ birthdays: [] }),

			updateSettings: (newSettings) =>
				set((state) => ({
					settings: { ...state.settings, ...newSettings },
				})),

			importData: (data) => set({ birthdays: data }),
		}),
		{
			name: "daybook-storage",
			merge: (persistedState: unknown, currentState) => {
				const state = persistedState as Partial<DayBookState>;

				return {
					...currentState,
					...state,
					settings: {
						...defaultSettings,
						...(state?.settings || {}),
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
					},
				} as DayBookState;
			},
		},
	),
);
