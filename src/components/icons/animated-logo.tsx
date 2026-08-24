import { APP_INFO } from "@/constants/app-info";
import { cn } from "@/lib/utils";
import { useDayBookStore } from "@/store/day-book-store";
import { play } from "cuelume";
import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from "react";
import { Logo } from "./logo";
import { LogoIcon } from "./logo-icon";
import { LogoInviteIcon } from "./logo-invite-icon";
import { LogoResponseIcon } from "./logo-response-icon";
import { LogoShareIcon } from "./logo-share-icon";
import { LogoWarningIcon } from "./logo-warning-icon";

export interface AnimatedLogoRef {
	triggerAnimation: () => void;
}

export type AnimatedLogoVariant = "default" | "invite" | "warning" | "share" | "response";

export interface AnimatedLogoProps {
	type?: "icon" | "full";
	variant?: AnimatedLogoVariant;
	className?: string;
	iconClassName?: string;
	asButton?: boolean;
	autoPlay?: boolean;
}

const variantComponents: Record<
	AnimatedLogoVariant,
	React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
	default: LogoIcon,
	invite: LogoInviteIcon,
	warning: LogoWarningIcon,
	share: LogoShareIcon,
	response: LogoResponseIcon,
};

export const AnimatedLogo = forwardRef<AnimatedLogoRef, AnimatedLogoProps>(
	(
		{
			type = "icon",
			variant = "default",
			className,
			iconClassName,
			asButton = true,
			autoPlay = false,
		},
		ref,
	) => {
		const [isAnimating, setIsAnimating] = useState(false);
		const { animationsEnabled } = useDayBookStore((state) => state.settings);

		const isAnimatingRef = useRef(isAnimating);
		useEffect(() => {
			isAnimatingRef.current = isAnimating;
		}, [isAnimating]);

		const LogoComponent = type === "full" ? Logo : variantComponents[variant];

		const trigger = () => {
			if (isAnimating || !animationsEnabled) return;
			setIsAnimating(true);
			play("sparkle");
		};

		useImperativeHandle(ref, () => ({
			triggerAnimation: trigger,
		}));

		useEffect(() => {
			if (autoPlay) {
				const timer = setTimeout(() => {
					const currentAnimationsEnabled = useDayBookStore.getState().settings.animationsEnabled;
					if (isAnimatingRef.current || !currentAnimationsEnabled) return;
					setIsAnimating(true);
					play("sparkle");
				}, 500);
				return () => clearTimeout(timer);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [autoPlay]);

		const handleClick = () => {
			if (isAnimating || !animationsEnabled) return;
			setIsAnimating(true);
		};

		const Wrapper = asButton ? "button" : "div";

		return (
			<Wrapper
				type={asButton ? "button" : undefined}
				className={cn(
					"group focus-visible:ring-ring relative inline-flex cursor-pointer items-center justify-center rounded-3xl transition-transform outline-none select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] focus-visible:ring-2",
					className,
				)}
				onClick={handleClick}
				aria-label={`Play ${APP_INFO.name} animation`}
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
	},
);

AnimatedLogo.displayName = "AnimatedLogo";
