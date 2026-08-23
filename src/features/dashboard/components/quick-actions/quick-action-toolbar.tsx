import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDayBookStore } from "@/store/day-book-store";
import type { QuickActionsPosition } from "@/types/settings";
import { ChevronLeftIcon, ChevronRightIcon, GripVerticalIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, type PanInfo } from "motion/react";
import { useEffect, useState } from "react";
import { QuickActionAvatar } from "./quick-action-avatar";
import { QuickActionGreeting } from "./quick-action-greeting";

export function QuickActionToolbar() {
	const { settings, updateSettings } = useDayBookStore();
	const isEnabled = settings.quickActionsEnabled ?? true;
	const position = settings.quickActionsPosition ?? "bottom-right";
	const isOpen = settings.quickActionsIsOpen ?? false;

	const setIsOpen = (open: boolean) => updateSettings({ quickActionsIsOpen: open });

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	if (!isEnabled) return null;

	const actualPosition = isMobile ? "bottom-right" : position;

	const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		if (isMobile) return;

		// Calculate drop location relative to screen center
		const dropX = event instanceof MouseEvent ? event.clientX : info.point.x;
		const dropY = event instanceof MouseEvent ? event.clientY : info.point.y;

		const halfWidth = window.innerWidth / 2;
		const halfHeight = window.innerHeight / 2;

		let newPos: QuickActionsPosition = "bottom-right";
		if (dropX < halfWidth && dropY < halfHeight) newPos = "top-left";
		else if (dropX >= halfWidth && dropY < halfHeight) newPos = "top-right";
		else if (dropX < halfWidth && dropY >= halfHeight) newPos = "bottom-left";
		else newPos = "bottom-right";

		const isPosChanged = newPos !== actualPosition;

		// Update position and clear local motion offsets so layout animation takes over smoothly
		updateSettings({ quickActionsPosition: newPos });

		// If pushed close to the screen edges, automatically minimize (dock out)
		const edgeThreshold = 40;
		const shouldClose =
			dropX < edgeThreshold ||
			dropX > window.innerWidth - edgeThreshold ||
			dropY < edgeThreshold ||
			dropY > window.innerHeight - edgeThreshold;

		if (shouldClose) {
			if (isPosChanged) {
				// Base position changed: reset offsets instantly to avoid jumping off-screen.
				// Wait for React to render the new position classes before closing,
				// so AnimatePresence captures the correct exit animation direction.
				x.set(0);
				y.set(0);
				setTimeout(() => setIsOpen(false), 50);
			} else {
				// Base position didn't change: keep offsets so it exits smoothly from the drop point.
				setIsOpen(false);
				setTimeout(() => {
					x.set(0);
					y.set(0);
				}, 300);
			}
		} else {
			x.set(0);
			y.set(0);
		}
	};

	const positionClasses = {
		"top-left": "top-20 left-4 md:top-24 md:left-6",
		"top-right": "top-20 right-4 md:top-24 md:right-6",
		"bottom-left": "bottom-4 left-4 md:bottom-6 md:left-6",
		"bottom-right": "bottom-4 right-4 md:bottom-6 md:right-6",
	};

	const isBottom = actualPosition.includes("bottom");
	const isLeft = actualPosition.includes("left");
	const ChevronIcon = isLeft ? ChevronRightIcon : ChevronLeftIcon;

	const slideVariants = {
		hidden: { opacity: 0, x: isLeft ? -40 : 40, scale: 0.95 },
		visible: { opacity: 1, x: 0, scale: 1 },
		exit: { opacity: 0, x: isLeft ? -40 : 40, scale: 0.95 },
	};

	const tabVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.8 },
	};

	return (
		<AnimatePresence mode="wait">
			{!isOpen ? (
				<motion.div
					key="closed-tab"
					id="quick-action-tab"
					variants={tabVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={{ duration: 0.2 }}
					className={cn(
						"bg-background/90 hover:bg-muted/80 fixed z-40 flex h-10 w-6 cursor-pointer items-center justify-center border shadow-lg backdrop-blur-xl transition-colors",
						// Edge alignment based on corner
						actualPosition === "top-left" && "top-20 left-0 rounded-r-md border-l-0 md:top-24",
						actualPosition === "top-right" && "top-20 right-0 rounded-l-md border-r-0 md:top-24",
						actualPosition === "bottom-left" && "bottom-8 left-0 rounded-r-md border-l-0",
						actualPosition === "bottom-right" && "right-0 bottom-8 rounded-l-md border-r-0",
						// Add bottom safe area margin if bottom docked
						isBottom && "mb-[env(safe-area-inset-bottom)]",
					)}
					onClick={() => setIsOpen(true)}
					title="Open Quick Actions"
					aria-label="Open Quick Actions"
				>
					<ChevronIcon className="text-muted-foreground h-4 w-4" />
				</motion.div>
			) : (
				<motion.div
					key="open-toolbar"
					variants={slideVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={{ duration: 0.2, type: "spring", bounce: 0, damping: 20 }}
					drag={!isMobile}
					dragElastic={0}
					dragMomentum={false}
					style={{ x, y }}
					onDragEnd={handleDragEnd}
					className={cn(
						"bg-background/85 ring-border fixed z-40 flex overflow-hidden rounded-2xl shadow-xl ring-1 backdrop-blur-xl",
						!isMobile && "cursor-grab",
						positionClasses[actualPosition],
						"w-full max-w-[95vw] flex-row md:w-auto",
						isBottom && "mb-[env(safe-area-inset-bottom)]",
					)}
				>
					{!isMobile && (
						<div
							className="bg-muted/30 flex shrink-0 items-center justify-center border-r p-1"
							title="Drag to dock"
						>
							<GripVerticalIcon className="text-muted-foreground pointer-events-none h-4 w-4" />
						</div>
					)}
					<div
						className={cn(
							"flex flex-1 flex-row divide-x overflow-y-auto",
							isMobile && "max-h-[60vh] flex-col divide-x-0 divide-y",
						)}
					>
						<QuickActionAvatar />
						<QuickActionGreeting />
					</div>

					<div className="bg-muted/30 flex shrink-0 flex-col items-center justify-center border-l p-1.5">
						<Button
							variant="ghost"
							size="icon"
							className="text-muted-foreground hover:bg-muted/80 h-7 w-7"
							onClick={() => setIsOpen(false)}
							title="Close Quick Actions"
							aria-label="Close Quick Actions"
						>
							<XIcon className="pointer-events-none h-4 w-4" />
						</Button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
