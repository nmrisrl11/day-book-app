import { useEffect, useState } from "react";

const MESSAGES = [
	"Happy Birthday! 🎂",
	"Make a wish! 🌟",
	"Party time! 🎈",
	"Cheers! 🥂",
	"Have a blast! 🎉",
	"Celebrate! 🥳",
];

interface FloatingMessage {
	id: number;
	text: string;
	left: number; // percentage
	delay: number;
}

export function FloatingMessages({ enabled }: { enabled: boolean }) {
	const [messages, setMessages] = useState<FloatingMessage[]>([]);

	useEffect(() => {
		if (!enabled) return;

		let messageId = 0;
		const interval = setInterval(() => {
			const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
			// Keep messages within the center 60% to avoid edge overflow on mobile
			const left = 15 + Math.random() * 55;
			const delay = Math.random() * 0.5;

			const newMessage: FloatingMessage = {
				id: messageId++,
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
	}, [enabled]);

	if (!enabled) return null;

	return (
		<div className="pointer-events-none absolute inset-0 z-50 overflow-hidden" aria-hidden="true">
			{messages.map((msg) => (
				<div
					key={msg.id}
					className="absolute bottom-10 animate-float-up opacity-0"
					style={{
						left: `${msg.left}%`,
						animationDelay: `${msg.delay}s`,
					}}
				>
					<div className="whitespace-nowrap rounded-full bg-background/80 px-4 py-2 font-bold text-foreground shadow-xl backdrop-blur-sm text-sm md:text-base border border-border/50">
						{msg.text}
					</div>
				</div>
			))}
		</div>
	);
}
