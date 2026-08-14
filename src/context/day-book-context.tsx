import type { Birthday } from "@/types/birthday";
import type { Settings } from "@/types/settings";
import React, { createContext, useContext, useEffect, useState } from "react";

interface DayBookContextType {
	birthdays: Birthday[];
	settings: Settings;
	addBirthday: (birthday: Omit<Birthday, "id">) => void;
	editBirthday: (birthday: Birthday) => void;
	deleteBirthday: (id: string) => void;
	deleteAllBirthdays: () => void;
	updateSettings: (settings: Partial<Settings>) => void;
	importData: (data: Birthday[]) => void;
}

const defaultSettings: Settings = {
	upcomingCount: 5,
	theme: "light",
};

const DayBookContext = createContext<DayBookContextType | undefined>(undefined);

export function DayBookProvider({ children }: { children: React.ReactNode }) {
	const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
		try {
			const saved = localStorage.getItem("daybook_birthdays");
			return saved ? JSON.parse(saved) : [];
		} catch (error) {
			console.error("Failed to parse birthdays from localStorage", error);
			return [];
		}
	});

	const [settings, setSettings] = useState<Settings>(() => {
		try {
			const saved = localStorage.getItem("daybook_settings");
			return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
		} catch (error) {
			console.error("Failed to parse settings from localStorage", error);
			return defaultSettings;
		}
	});

	useEffect(() => {
		localStorage.setItem("daybook_birthdays", JSON.stringify(birthdays));
	}, [birthdays]);

	useEffect(() => {
		localStorage.setItem("daybook_settings", JSON.stringify(settings));
		// Apply theme
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(settings.theme);
	}, [settings]);

	const addBirthday = (birthday: Omit<Birthday, "id">) => {
		const newBirthday: Birthday = {
			...birthday,
			id: crypto.randomUUID(),
		};
		setBirthdays((prev) => [...prev, newBirthday]);
	};

	const editBirthday = (birthday: Birthday) => {
		setBirthdays((prev) => prev.map((b) => (b.id === birthday.id ? birthday : b)));
	};

	const deleteBirthday = (id: string) => {
		setBirthdays((prev) => prev.filter((b) => b.id !== id));
	};

	const deleteAllBirthdays = () => {
		setBirthdays([]);
	};

	const updateSettings = (newSettings: Partial<Settings>) => {
		setSettings((prev) => ({ ...prev, ...newSettings }));
	};

	const importData = (data: Birthday[]) => {
		// For Phase 2, we replace the data completely. (Based on plan option 1)
		setBirthdays(data);
	};

	return (
		<DayBookContext.Provider
			value={{
				birthdays,
				settings,
				addBirthday,
				editBirthday,
				deleteBirthday,
				deleteAllBirthdays,
				updateSettings,
				importData,
			}}
		>
			{children}
		</DayBookContext.Provider>
	);
}

export function useDayBook() {
	const context = useContext(DayBookContext);
	if (context === undefined) {
		throw new Error("useDayBook must be used within a DayBookProvider");
	}
	return context;
}
