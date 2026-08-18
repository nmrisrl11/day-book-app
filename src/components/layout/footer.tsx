import { GithubIcon } from "@/components/icons/github-icon";
import { BotIcon } from "@/components/ui/animated-icons/bot-icon";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { Button } from "@/components/ui/button";

export function Footer() {
	return (
		<footer className="text-muted-foreground mt-auto flex w-full items-center text-sm">
			<div className="flex w-full flex-col items-end justify-end gap-1">
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
