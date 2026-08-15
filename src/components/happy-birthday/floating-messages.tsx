import { useDayBookStore } from "@/store/day-book-store";
import { useEffect, useState, useRef } from "react";

interface FloatingMessage {
	id: number;
	text: string;
	left: number; // percentage
	delay: number;
}

export function FloatingMessages({ enabled }: { enabled: boolean }) {
	const floatingMessagesSetting = useDayBookStore((state) => state.settings.floatingMessages);
	const [messages, setMessages] = useState<FloatingMessage[]>([]);
	const messageId = useRef(0);

	useEffect(() => {
		if (!enabled) return;
		const floatingMessages =
			floatingMessagesSetting && floatingMessagesSetting.length > 0
				? floatingMessagesSetting
				: ["Happy Birthday! 🎂"]; // safe fallback

		const interval = setInterval(() => {
			const text = floatingMessages[Math.floor(Math.random() * floatingMessages.length)];
			// Keep messages within the center 60% to avoid edge overflow on mobile
			const left = 15 + Math.random() * 55;
			const delay = Math.random() * 0.5;

			const newMessage: FloatingMessage = {
				id: messageId.current++,
				text,
				left,
				delay,
			};

			setMessages((prev) => {
				// Keep only the last 10 to avoid DOM bloat if tab is backgrounded
				const next = [...prev, newMessage];
				if (next.length > 8) return next.slice(next.length - 8);
				return next;
			});
		}, 3500); // New message every 3.5s on average

		return () => clearInterval(interval);
	}, [enabled, floatingMessagesSetting]);

	if (!enabled) return null;

	return (
		<div className="pointer-events-none absolute inset-0 z-50 overflow-hidden" aria-hidden="true">
			{messages.map((msg) => (
				<div
					key={msg.id}
					className="animate-float-up absolute bottom-10 opacity-0"
					style={{
						left: `${msg.left}%`,
						animationDelay: `${msg.delay}s`,
					}}
				>
					<div className="bg-background/80 text-foreground border-border/50 rounded-full border px-4 py-2 text-sm font-bold whitespace-nowrap shadow-xl backdrop-blur-sm md:text-base">
						{msg.text}
					</div>
				</div>
			))}
		</div>
	);
}
