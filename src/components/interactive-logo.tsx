import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Logo } from "./icons/logo";
import { LogoIcon } from "./icons/logo-icon";
import { useDayBookStore } from "@/store/day-book-store";

export interface InteractiveLogoProps {
	type?: "icon" | "full";
	className?: string;
	iconClassName?: string;
	asButton?: boolean;
}

export function InteractiveLogo({
	type = "icon",
	className,
	iconClassName,
	asButton = true,
}: InteractiveLogoProps) {
	const [isAnimating, setIsAnimating] = useState(false);
	const { animationsEnabled } = useDayBookStore((state) => state.settings);
	const LogoComponent = type === "icon" ? LogoIcon : Logo;

	const handleClick = () => {
		if (isAnimating || !animationsEnabled) return;
		setIsAnimating(true);
	};

	const Wrapper = asButton ? "button" : "div";

	return (
		<Wrapper
			type={asButton ? "button" : undefined}
			className={cn(
				"group focus-visible:ring-ring relative inline-flex cursor-pointer items-center justify-center rounded-3xl transition-transform outline-none focus-visible:ring-2",
				className,
			)}
			onClick={handleClick}
			aria-label="Play DayBook animation"
			data-cuelume-release="sparkle"
		>
			<LogoComponent
				className={cn(
					"transition-transform duration-200 active:scale-90",
					isAnimating && "animate-logo-jelly",
					iconClassName,
				)}
			/>

			{/* Particles */}
			{isAnimating && (
				<div className="pointer-events-none absolute inset-0" aria-hidden="true">
					{/* Particle 1: Top Right */}
					<div
						className="bg-primary animate-particle-out absolute top-[20%] left-[60%] h-1.5 w-1.5 rounded-full"
						style={
							{ "--tx": "15px", "--ty": "-20px", animationDelay: "0ms" } as React.CSSProperties
						}
					/>
					{/* Particle 2: Top Left */}
					<div
						className="bg-primary animate-particle-out absolute top-[30%] left-[30%] h-1 w-1 rounded-full opacity-80"
						style={
							{ "--tx": "-20px", "--ty": "-15px", animationDelay: "50ms" } as React.CSSProperties
						}
					/>
					{/* Particle 3: Bottom Right */}
					<div
						className="bg-primary animate-particle-out absolute top-[70%] left-[70%] h-1 w-1 rounded-full opacity-60"
						style={
							{ "--tx": "20px", "--ty": "10px", animationDelay: "100ms" } as React.CSSProperties
						}
						onAnimationEnd={() => setIsAnimating(false)}
					/>
					{/* Particle 4: Left */}
					<div
						className="bg-primary animate-particle-out absolute top-[60%] left-[20%] h-1.5 w-1.5 rounded-full opacity-90"
						style={
							{ "--tx": "-25px", "--ty": "5px", animationDelay: "20ms" } as React.CSSProperties
						}
					/>
				</div>
			)}
		</Wrapper>
	);
}
