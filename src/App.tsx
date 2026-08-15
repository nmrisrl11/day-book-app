import { Footer } from "./components/layout/footer";
import { PageLayout } from "./components/layout/page-layout";
import { DayBookProvider } from "./context/day-book-context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

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

function MainApp() {
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

function App() {
	return (
		<DayBookProvider>
			<MainApp />
		</DayBookProvider>
	);
}

export default App;
