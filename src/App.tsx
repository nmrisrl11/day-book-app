import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/footer";
import { PageLayout } from "./components/layout/page-layout";
import { useDayBookStore } from "./store/day-book-store";

const Dashboard = lazy(() =>
	import("./components/dashboard/dashboard").then((m) => ({ default: m.Dashboard })),
);
const BirthdayManagementScreen = lazy(() =>
	import("./components/management/birthday-management-screen").then((m) => ({
		default: m.BirthdayManagementScreen,
	})),
);
const SettingsScreen = lazy(() =>
	import("./components/settings/settings-screen").then((m) => ({ default: m.SettingsScreen })),
);

function App() {
	const settings = useDayBookStore((state) => state.settings);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(settings.theme);
	}, [settings.theme]);

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
			<PageLayout>
				<Suspense
					fallback={
						<div className="flex min-h-[50vh] w-full items-center justify-center">
							<div className="text-muted-foreground animate-pulse text-lg">Loading...</div>
						</div>
					}
				>
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/manage" element={<BirthdayManagementScreen />} />
						<Route path="/settings" element={<SettingsScreen />} />
					</Routes>
				</Suspense>
				<Footer />
			</PageLayout>
		</BrowserRouter>
	);
}

export default App;
