import { bind, setEnabled, setVolume } from "cuelume";
import { NuqsAdapter } from "nuqs/adapters/react";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/footer";
import { PageLayout } from "./components/layout/page-layout";
import { DashboardSkeleton } from "./features/dashboard/components/dashboard-skeleton";
import { ManageBirthdaysSkeleton } from "./features/management/components/manage-birthdays-skeleton";
import { SettingsSkeleton } from "./features/settings/components/settings-skeleton";
import { useDayBookStore } from "./store/day-book-store";
import { PWAPrompt } from "./components/pwa-prompt";

const Dashboard = lazy(() =>
	import("./features/dashboard/dashboard").then((m) => ({ default: m.Dashboard })),
);
const ManageBirthdays = lazy(() =>
	import("./features/management/birthday-management-screen").then((m) => ({
		default: m.BirthdayManagementScreen,
	})),
);
const Settings = lazy(() =>
	import("./features/settings/settings-screen").then((m) => ({
		default: m.SettingsScreen,
	})),
);

function App() {
	const settings = useDayBookStore((state) => state.settings);
	const soundSettings = settings.soundSettings;

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(settings.theme);
	}, [settings.theme]);

	// Initialize cuelume and sync volume/enabled state
	useEffect(() => {
		bind();
	}, []);

	useEffect(() => {
		if (soundSettings) {
			setEnabled(soundSettings.enabled);
			setVolume(soundSettings.volume);
		}
	}, [soundSettings?.enabled, soundSettings?.volume]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.repeat) return;
			if (e.altKey && e.key.toLowerCase() === "t") {
				e.preventDefault();
				const currentTheme = useDayBookStore.getState().settings.theme;
				useDayBookStore.getState().updateSettings({
					theme: currentTheme === "light" ? "dark" : "light",
				});
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<BrowserRouter>
			<NuqsAdapter>
				<PageLayout>
					<Routes>
						<Route
							path="/"
							element={
								<Suspense fallback={<DashboardSkeleton />}>
									<Dashboard />
								</Suspense>
							}
						/>
						<Route
							path="/manage"
							element={
								<Suspense fallback={<ManageBirthdaysSkeleton />}>
									<ManageBirthdays />
								</Suspense>
							}
						/>
						<Route
							path="/settings"
							element={
								<Suspense fallback={<SettingsSkeleton />}>
									<Settings />
								</Suspense>
							}
						/>
					</Routes>
					<PWAPrompt />
					<Footer />
				</PageLayout>
			</NuqsAdapter>
		</BrowserRouter>
	);
}

export default App;
