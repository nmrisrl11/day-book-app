import { DEFAULT_FLOATING_MESSAGE } from "@/constants/floating-messages";
import { useDayBookStore } from "@/store/day-book-store";
import { useEffect, useRef, useState } from "react";

interface FloatingMessage {
	id: number;
	text: string;
	side: "left" | "right";
	position: number; // percentage
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
				: [DEFAULT_FLOATING_MESSAGE];

		const interval = setInterval(() => {
			const text = floatingMessages[Math.floor(Math.random() * floatingMessages.length)];
			// Anchor randomly to left or right to prevent long text from overflowing the edge
			const isLeft = Math.random() > 0.5;
			const position = 5 + Math.random() * 35; // 5% to 40% from either edge
			const delay = Math.random() * 0.5;

			const newMessage: FloatingMessage = {
				id: messageId.current++,
				text,
				side: isLeft ? "left" : "right",
				position,
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
					className="absolute bottom-10 animate-float-up opacity-0"
					style={{
						[msg.side]: `${msg.position}%`,
						animationDelay: `${msg.delay}s`,
					}}
				>
					<div className="rounded-full border border-border/50 bg-background/80 px-4 py-2 text-sm font-bold whitespace-nowrap text-foreground shadow-xl backdrop-blur-sm md:text-base">
						{msg.text}
					</div>
				</div>
			))}
		</div>
	);
}
