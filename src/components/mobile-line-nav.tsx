import { AlignJustifyIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LineNav, type LineNavItem } from "./line-nav";

interface MobileLineNavProps {
	items: LineNavItem[];
	activeId: string;
}

export function MobileLineNav({ items, activeId }: MobileLineNavProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Floating Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="fixed top-1/2 right-4 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md xl:hidden"
				aria-label="Open Table of Contents"
			>
				<AlignJustifyIcon className="h-5 w-5" />
			</button>

			{/* Overlay and Popover */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="fixed inset-0 z-100 bg-black/40 xl:hidden"
						/>

						{/* Menu */}
						<motion.div
							initial={{ x: "100%", opacity: 0, y: "-50%" }}
							animate={{ x: 0, opacity: 1, y: "-50%" }}
							exit={{ x: "100%", opacity: 0, y: "-50%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed top-1/2 right-4 z-101 flex max-h-[60dvh] w-65 flex-col rounded-2xl border border-border bg-card p-4 shadow-xl xl:hidden"
						>
							<div className="mb-4 flex shrink-0 items-center justify-between px-2">
								<h3 className="font-semibold text-foreground">On this page</h3>
								<button
									onClick={() => setIsOpen(false)}
									className="-m-1 rounded-md p-2 text-muted-foreground hover:bg-muted"
								>
									<XIcon className="h-4 w-4" />
								</button>
							</div>

							<div className="no-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
								<LineNav items={items} activeId={activeId} onItemClick={() => setIsOpen(false)} />
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
