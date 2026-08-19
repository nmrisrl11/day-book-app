import { APP_INFO } from "@/constants/app-info";
import { gooeyToast } from "goey-toast";
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

	useEffect(() => {
		if (needRefresh) {
			gooeyToast.info("Update available", {
				id: "pwa-update",
				description: `A newer version of ${APP_INFO.name} is ready.`,
				duration: Infinity,
				timing: { displayDuration: 86400000 }, // Fix for goey-toast internal morph-collapse timer
				showTimestamp: false,
				classNames: {
					content: "items-center text-center",
					title: "text-center w-full",
					description: "text-center justify-center flex w-full",
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

	return null;
}
