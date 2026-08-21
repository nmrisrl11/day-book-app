import { AnimateIcon } from "@/components/ui/animate-icon";
import { BotIcon } from "@/components/ui/animated-icons/bot-icon";
import { VisitorTracker } from "@/components/visitor-tracker";

export function Footer() {
	return (
		<footer className="text-muted-foreground mt-auto flex w-full flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
			<VisitorTracker className="justify-center" />

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
		</footer>
	);
}
