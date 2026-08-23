import { APP_INFO } from "@/constants/app-info";
import { gooeyToast } from "goey-toast";
import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export function PWAPrompt() {
	const {
		needRefresh: [needRefresh, setNeedRefresh],
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
				onDismiss: () => {
					setNeedRefresh(false);
				},
			});
		}
	}, [needRefresh, setNeedRefresh, updateServiceWorker]);

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

	return null;
}
