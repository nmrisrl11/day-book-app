import { AnimateIcon } from "@/components/ui/animate-icon";
import { BotIcon } from "@/components/ui/animated-icons/bot-icon";
import { Link } from "react-router-dom";

export function Footer() {
	return (
		<footer className="text-muted-foreground mt-auto flex w-full justify-center">
			<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
				<span className="text-[0.8rem]">
					Developed by:
					<AnimateIcon animateOnHover asChild>
						<a
							href="https://www.nmrisrl.dev/"
							target="_blank"
							rel="noopener noreferrer"
							title="Visit Developer's Website"
							className="ml-1 inline-flex items-center font-medium transition-colors hover:text-slate-800 dark:hover:text-slate-200"
						>
							Nomer with <BotIcon className="ml-1 h-4 w-4" />
						</a>
					</AnimateIcon>
				</span>
				<span className="hidden text-muted-foreground/30 sm:inline">•</span>
				<Link
					to="/install"
					className="text-[0.8rem] font-medium transition-colors hover:text-slate-800 dark:hover:text-slate-200"
				>
					Install App
				</Link>
			</div>
		</footer>
	);
}
