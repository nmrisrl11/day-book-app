import { GithubIcon } from "@/components/icons/github-icon";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { BotIcon } from "@/components/ui/animated-icons/bot-icon";
import { Button } from "@/components/ui/button";
import { VisitorTracker } from "@/components/visitor-tracker";

export function Footer() {
	return (
		<footer className="text-muted-foreground mt-auto flex w-full flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
			<VisitorTracker className="justify-center" />

			<div className="flex flex-1 flex-col items-center justify-end gap-1 sm:items-end">
				<div className="flex">
					<Button variant="ghost" size="sm" asChild>
						<a
							href="https://github.com/nmrisrl11/day-book-app"
							target="_blank"
							rel="noopener noreferrer"
							title="View GitHub Repository"
						>
							<GithubIcon aria-hidden="true" className="mr-1 h-4 w-4" />
							GitHub Repository
						</a>
					</Button>
				</div>

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
			</div>
		</footer>
	);
}
