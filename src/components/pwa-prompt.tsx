import { APP_INFO } from "@/constants/app-info";
import { gooeyToast } from "goey-toast";
import { ShareIcon } from "lucide-react";
import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export function PWAPrompt() {
	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(r) {
			if (import.meta.env.VITE_VERCEL_ENV !== "production") {
				console.log("SW Registered:", r);
			}
		},
		onRegisterError(error) {
			console.error("SW Registration Error:", error);
		},
	});

	// Handle PWA Update Prompt
	useEffect(() => {
		if (needRefresh) {
			gooeyToast.info("Update available", {
				id: "pwa-update",
				description: (
					<div>
						A newer version of <span className="font-semibold">{APP_INFO.name}</span> is ready!
						<br />
						Check the About page to see what's new after updating.
					</div>
				),
				duration: Infinity,
				timing: { displayDuration: 86400000 },
				showTimestamp: false,
				classNames: {
					content: "items-center text-center",
					title: "text-center w-full",
				},
				action: {
					label: "Update",
					successLabel: "Updating...",
					onClick: () => {
						updateServiceWorker(true);
					},
				},
			});
		}
	}, [needRefresh, updateServiceWorker]);

	// Handle Online/Offline Status
	useEffect(() => {
		const handleOnline = () => {
			gooeyToast.success("Back Online", {
				id: "online-status",
				description: "Your connection has been restored.",
				showTimestamp: false,
			});
		};

		const handleOffline = () => {
			gooeyToast.warning("You are offline", {
				id: "offline-status",
				description: `${APP_INFO.name} will continue to work normally offline.`,
				showTimestamp: false,
			});
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	// Handle iOS Install Instructions
	useEffect(() => {
		const isIOS =
			(/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)) ||
			(navigator.userAgent.includes("Mac") && "ontouchend" in document);

		const nav = window.navigator as Navigator & { standalone?: boolean };
		const isStandalone =
			window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;

		if (isIOS && !isStandalone) {
			const hasSeenPrompt = localStorage.getItem("ios-install-prompt-dismissed");

			if (!hasSeenPrompt) {
				// Delay the prompt slightly so it doesn't clash with initial render
				const timer = setTimeout(() => {
					gooeyToast.info("Install as an App", {
						id: "ios-install-prompt",
						description: (
							<div className="flex flex-col items-center gap-2">
								<span>To install {APP_INFO.name} on your iPhone/iPad:</span>
								<span className="text-foreground flex items-center gap-1 font-medium">
									Tap <ShareIcon className="h-4 w-4" /> Share
								</span>
								<span className="text-foreground font-medium">Then tap "Add to Home Screen"</span>
							</div>
						),
						duration: 15000,
						showTimestamp: false,
						classNames: {
							content: "items-center text-center",
							title: "text-center w-full",
							description: "text-center flex w-full flex-col items-center",
						},
						action: {
							label: "Got it",
							onClick: () => {
								localStorage.setItem("ios-install-prompt-dismissed", "true");
								gooeyToast.dismiss("ios-install-prompt");
							},
						},
					});
				}, 3000);

				return () => clearTimeout(timer);
			}
		}
	}, []);

	return null;
}
