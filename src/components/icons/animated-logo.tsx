import { APP_INFO } from "@/constants/app-info";
import { cn } from "@/lib/utils";
import { useDayBookStore } from "@/store/day-book-store";
import { play } from "cuelume";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { ComponentType, CSSProperties, SVGProps } from "react";
import { Logo } from "./logos/logo";
import { Logo404Icon } from "./logos/logo-404-icon";
import { LogoBackupIcon } from "./logos/logo-backup-icon";
import { LogoCrystalBallIcon } from "./logos/logo-crystal-ball-icon";
import { LogoIcon } from "./logos/logo-icon";
import { LogoInviteIcon } from "./logos/logo-invite-icon";
import { LogoNotificationIcon } from "./logos/logo-notification-icon";
import { LogoResponseIcon } from "./logos/logo-response-icon";
import { LogoShareIcon } from "./logos/logo-share-icon";
import { LogoWarningIcon } from "./logos/logo-warning-icon";

export interface AnimatedLogoRef {
	triggerAnimation: () => void;
}

export type AnimatedLogoVariant =
	| "default"
	| "invite"
	| "warning"
	| "share"
	| "response"
	| "404"
	| "backup"
	| "crystal-ball"
	| "notification";

export interface AnimatedLogoProps {
	type?: "icon" | "full";
	variant?: AnimatedLogoVariant;
	className?: string;
	iconClassName?: string;
	asButton?: boolean;
	autoPlay?: boolean;
	animationType?: "sparkles" | "confetti";
}

const variantComponents: Record<AnimatedLogoVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
	default: LogoIcon,
	invite: LogoInviteIcon,
	warning: LogoWarningIcon,
	share: LogoShareIcon,
	response: LogoResponseIcon,
	"404": Logo404Icon,
	backup: LogoBackupIcon,
	"crystal-ball": LogoCrystalBallIcon,
	notification: LogoNotificationIcon,
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
			animationType = "sparkles",
		},
		ref,
	) => {
		const [isAnimating, setIsAnimating] = useState(false);
		const animationsEnabled = useDayBookStore((state) => state.settings.animationsEnabled);

		const LogoComponent = type === "full" ? Logo : variantComponents[variant];

		const startAnimation = (isManualPlay = false) => {
			if (isAnimating || !animationsEnabled) return;
			setIsAnimating(true);
			if (isManualPlay) {
				play("sparkle");
			}
		};

		useImperativeHandle(ref, () => ({
			triggerAnimation: () => startAnimation(true),
		}));

		useEffect(() => {
			if (!autoPlay) return;

			const timer = setTimeout(() => {
				setIsAnimating((prev) => {
					if (prev) return prev;
					// Fetch the latest state to avoid stale closure issues if not fully synchronized,
					// though we are in a mount effect, it's safer to check current store state.
					const currentAnimationsEnabled = useDayBookStore.getState().settings.animationsEnabled;
					if (!currentAnimationsEnabled) return false;

					play("sparkle");
					return true;
				});
			}, 500);

			return () => clearTimeout(timer);
		}, [autoPlay]);

		const Wrapper = asButton ? "button" : "div";

		return (
			<Wrapper
				type={asButton ? "button" : undefined}
				className={cn(
					"group focus-visible:ring-ring relative inline-flex cursor-pointer items-center justify-center rounded-3xl transition-transform outline-none select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] focus-visible:ring-2",
					className,
				)}
				onClick={() => startAnimation(false)}
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
				{isAnimating && animationType === "sparkles" && (
					<div className="pointer-events-none absolute inset-0" aria-hidden="true">
						{/* Particle 1: Top Right */}
						<div
							className="bg-primary animate-particle-out absolute top-[20%] left-[60%] h-1.5 w-1.5 rounded-full"
							style={{ "--tx": "15px", "--ty": "-20px", animationDelay: "0ms" } as CSSProperties}
						/>
						{/* Particle 2: Top Left */}
						<div
							className="bg-primary animate-particle-out absolute top-[30%] left-[30%] h-1 w-1 rounded-full opacity-80"
							style={{ "--tx": "-20px", "--ty": "-15px", animationDelay: "50ms" } as CSSProperties}
						/>
						{/* Particle 3: Bottom Right */}
						<div
							className="bg-primary animate-particle-out absolute top-[70%] left-[70%] h-1 w-1 rounded-full opacity-60"
							style={{ "--tx": "20px", "--ty": "10px", animationDelay: "100ms" } as CSSProperties}
							onAnimationEnd={() => setIsAnimating(false)}
						/>
						{/* Particle 4: Left */}
						<div
							className="bg-primary animate-particle-out absolute top-[60%] left-[20%] h-1.5 w-1.5 rounded-full opacity-90"
							style={{ "--tx": "-25px", "--ty": "5px", animationDelay: "20ms" } as CSSProperties}
						/>
					</div>
				)}

				{isAnimating && animationType === "confetti" && (
					<div className="pointer-events-none absolute inset-0" aria-hidden="true">
						<div
							className="animate-particle-out absolute top-[20%] left-[50%]"
							style={{ "--tx": "-25px", "--ty": "-30px", animationDelay: "0ms" } as CSSProperties}
						>
							<div className="bg-red-500 h-2 w-1.5 rounded-[1px] -rotate-12" />
						</div>
						<div
							className="animate-particle-out absolute top-[30%] left-[60%]"
							style={{ "--tx": "30px", "--ty": "-20px", animationDelay: "20ms" } as CSSProperties}
						>
							<div className="bg-blue-500 h-1.5 w-2 rounded-[1px] rotate-45" />
						</div>
						<div
							className="animate-particle-out absolute top-[60%] left-[70%]"
							style={{ "--tx": "25px", "--ty": "20px", animationDelay: "40ms" } as CSSProperties}
						>
							<div className="bg-yellow-500 h-2 w-1.5 rounded-[1px] rotate-75" />
						</div>
						<div
							className="animate-particle-out absolute top-[70%] left-[30%]"
							style={{ "--tx": "-20px", "--ty": "25px", animationDelay: "60ms" } as CSSProperties}
							onAnimationEnd={() => setIsAnimating(false)}
						>
							<div className="bg-green-500 h-1.5 w-2 rounded-[1px] rotate-12" />
						</div>
						<div
							className="animate-particle-out absolute top-[40%] left-[20%]"
							style={{ "--tx": "-30px", "--ty": "5px", animationDelay: "10ms" } as CSSProperties}
						>
							<div className="bg-purple-500 h-2 w-1.5 rounded-[1px] -rotate-45" />
						</div>
						<div
							className="animate-particle-out absolute top-[20%] left-[30%]"
							style={{ "--tx": "-15px", "--ty": "-20px", animationDelay: "30ms" } as CSSProperties}
						>
							<div className="bg-pink-500 h-1.5 w-1.5 rounded-full" />
						</div>
					</div>
				)}
			</Wrapper>
		);
	},
);
