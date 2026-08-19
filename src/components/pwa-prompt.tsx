import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "./ui/button";

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

	if (!needRefresh) return null;

	return (
		<div className="bg-card animate-in slide-in-from-bottom-5 fixed right-4 bottom-4 z-50 flex items-center gap-4 rounded-xl border p-4 shadow-lg">
			<div className="flex flex-col gap-1">
				<p className="text-sm font-semibold">Update available!</p>
				<p className="text-muted-foreground text-xs">A new version of DayBook is available.</p>
			</div>
			<div className="flex items-center gap-2">
				<Button size="sm" variant="outline" onClick={() => setNeedRefresh(false)}>
					Dismiss
				</Button>
				<Button size="sm" onClick={() => updateServiceWorker(true)}>
					Reload
				</Button>
			</div>
		</div>
	);
}
