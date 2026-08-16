import { useDayBookStore } from "@/store/day-book-store";
import { useEffect, useRef } from "react";

export function useConfetti(enabled: boolean) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const animationsEnabled = useDayBookStore((state) => state.settings.animationsEnabled ?? true);

	useEffect(() => {
		if (!enabled) return;

		if (!animationsEnabled) return;

		let active = true;

		import("canvas-confetti").then(({ default: confetti }) => {
			if (!active) return;

			// Helper to fire a subtle burst of confetti
			const fireConfetti = () => {
				const duration = 3000;
				const animationEnd = Date.now() + duration;
				const defaults = {
					startVelocity: 25,
					spread: 360,
					ticks: 60,
					zIndex: 50,
				};

				if (intervalRef.current) clearInterval(intervalRef.current);

				intervalRef.current = setInterval(function () {
					const timeLeft = animationEnd - Date.now();

					if (timeLeft <= 0) {
						if (intervalRef.current) clearInterval(intervalRef.current);
						return;
					}

					const particleCount = 20 * (timeLeft / duration);
					// since particles fall down, start a bit higher than random
					confetti({
						...defaults,
						particleCount,
						origin: { x: Math.random(), y: Math.random() - 0.2 },
						colors: ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"],
						disableForReducedMotion: true,
					});
				}, 250);
			};

			// Fire immediately once if there are celebrants
			fireConfetti();

			// Then schedule occasional random confetti (every 10 - 25 seconds)
			const scheduleNext = () => {
				const nextTime = Math.random() * 15000 + 10000;
				timeoutRef.current = setTimeout(() => {
					fireConfetti();
					scheduleNext();
				}, nextTime);
			};

			scheduleNext();
		});

		return () => {
			active = false;
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [enabled, animationsEnabled]);
}
