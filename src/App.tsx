import { OnboardingProvider } from "@/features/onboarding/components/onboarding-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { bind, setEnabled, setVolume } from "cuelume";
import { GooeyToaster } from "goey-toast";
import { NuqsAdapter } from "nuqs/adapters/react";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/footer";
import { PageLayout } from "./components/layout/page-layout";
import { PWAPrompt } from "./components/pwa-prompt";
import { AboutSkeleton } from "./features/about/components/about-skeleton";
import { DashboardRouteFallback } from "./features/dashboard/components/dashboard-route-fallback";
import { InstallSkeleton } from "./features/install/components/install-skeleton";
import { InvitationSkeleton } from "./features/invitation/components/invitation-skeleton";
import { ResponseSkeleton } from "./features/invitation/components/response-skeleton";
import { ManageRouteFallback } from "./features/management/components/manage-route-fallback";
import { SettingsSkeleton } from "./features/settings/components/settings-skeleton";
import { useDayBookStore } from "./store/day-book-store";

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: Array<string>;
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
	prompt(): Promise<void>;
}

declare global {
	interface Window {
		__hasInstallListener?: boolean;
		__deferredPrompt?: BeforeInstallPromptEvent | null;
		__isInstallable?: boolean;
	}
}

// Catch the install prompt as early as possible (before lazy-loaded screens)
if (typeof window !== "undefined" && !window.__hasInstallListener) {
	window.__hasInstallListener = true;
	window.addEventListener("beforeinstallprompt", (e) => {
		e.preventDefault();
		window.__deferredPrompt = e as BeforeInstallPromptEvent;
		window.__isInstallable = true;
		window.dispatchEvent(new Event("app-installable"));
	});
}

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
const InstallScreen = lazy(() =>
	import("@/features/install/install-screen").then((m) => ({ default: m.InstallScreen })),
);
const Invitation = lazy(() =>
	import("./features/invitation/invitation-screen").then((m) => ({
		default: m.InvitationScreen,
	})),
);
const Response = lazy(() =>
	import("./features/invitation/response-screen").then((m) => ({
		default: m.ResponseScreen,
	})),
);
const About = lazy(() =>
	import("./features/about/about-screen").then((m) => ({
		default: m.AboutScreen,
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
	}, [soundSettings, soundSettings?.enabled, soundSettings?.volume]);

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
				<OnboardingProvider>
					<PageLayout>
						<Routes>
							<Route
								path="/"
								element={
									<Suspense fallback={<DashboardRouteFallback />}>
										<Dashboard />
									</Suspense>
								}
							/>
							<Route
								path="/manage"
								element={
									<Suspense fallback={<ManageRouteFallback />}>
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
							<Route
								path="/about"
								element={
									<Suspense fallback={<AboutSkeleton />}>
										<About />
									</Suspense>
								}
							/>
							<Route
								path="/install"
								element={
									<Suspense fallback={<InstallSkeleton />}>
										<InstallScreen />
									</Suspense>
								}
							/>
							<Route
								path="/invite"
								element={
									<Suspense fallback={<InvitationSkeleton />}>
										<Invitation />
									</Suspense>
								}
							/>
							<Route
								path="/invite/response"
								element={
									<Suspense fallback={<ResponseSkeleton />}>
										<Response />
									</Suspense>
								}
							/>
						</Routes>
						<Analytics
							beforeSend={(event) => {
								if (event.url.includes("/invite")) {
									return null;
								}
								return event;
							}}
						/>
						<SpeedInsights
							beforeSend={(event) => {
								if (event.url.includes("/invite")) {
									return null;
								}
								return event;
							}}
						/>
						<PWAPrompt />
						<GooeyToaster
							position="bottom-center"
							theme={settings.theme}
							closeOnEscape={false}
							showTimestamp={false}
							closeButton="top-right"
						/>
						<Footer />
					</PageLayout>
				</OnboardingProvider>
			</NuqsAdapter>
		</BrowserRouter>
	);
}

export default App;
