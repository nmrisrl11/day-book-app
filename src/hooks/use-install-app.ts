import { useEffect, useState } from "react";

// The BeforeInstallPromptEvent is not fully standard yet, so we define it here
export interface BeforeInstallPromptEvent extends Event {
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

export function useInstallApp() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
		window.__deferredPrompt || null,
	);
	const [isInstallable, setIsInstallable] = useState(window.__isInstallable || false);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isIOS, setIsIOS] = useState(false);
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		// Detect if already installed (standalone mode)
		const checkIsInstalled = () => {
			const nav = window.navigator as Navigator & { standalone?: boolean };
			const standalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				window.matchMedia("(display-mode: window-controls-overlay)").matches ||
				window.matchMedia("(display-mode: fullscreen)").matches ||
				nav.standalone === true;
			setIsInstalled(standalone);
		};

		checkIsInstalled();

		// Sync with global state immediately in case the event fired between initial render and this effect
		if (window.__isInstallable) {
			setIsInstallable(true);
			setDeferredPrompt(window.__deferredPrompt || null);
			setIsChecking(false);
		}

		// Listen for display mode changes
		const mediaQuery = window.matchMedia("(display-mode: standalone)");
		const handleChange = (e: MediaQueryListEvent) => {
			setIsInstalled(e.matches);
		};
		mediaQuery.addEventListener("change", handleChange);

		// Check if iOS (where beforeinstallprompt is not supported)
		const checkIsIOS = () => {
			const ios =
				(/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)) ||
				(navigator.userAgent.includes("Mac") && "ontouchend" in document);
			setIsIOS(ios);
		};
		checkIsIOS();

		// Update state if the custom event fires while mounted
		const handleAppInstallable = () => {
			setDeferredPrompt(window.__deferredPrompt || null);
			setIsInstallable(window.__isInstallable || false);
		};
		window.addEventListener("app-installable", handleAppInstallable);

		// Also listen for the prompt directly just in case
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			window.__deferredPrompt = e as BeforeInstallPromptEvent;
			window.__isInstallable = true;
			setDeferredPrompt(window.__deferredPrompt);
			setIsInstallable(true);
			setIsChecking(false);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		const timer = setTimeout(() => {
			setIsChecking(false);
		}, 800);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
			window.removeEventListener("app-installable", handleAppInstallable);
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			clearTimeout(timer);
		};
	}, []);

	const promptInstall = async () => {
		if (!deferredPrompt) {
			return;
		}
		// Show the install prompt
		await deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") {
			console.log("User accepted the install prompt");
			setDeferredPrompt(null);
			setIsInstallable(false);
		} else {
			console.log("User dismissed the install prompt");
		}
		// The prompt is single-use; clear shared window values regardless of outcome
		window.__deferredPrompt = null;
		window.__isInstallable = false;
	};

	return {
		isInstallable,
		isInstalled,
		isIOS,
		isChecking,
		promptInstall,
	};
}
