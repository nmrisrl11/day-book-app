import { AnimateIcon } from "@/components/ui/animate-icon";
import { BotIcon } from "@/components/ui/animated-icons/bot-icon";
import { APP_INFO } from "@/constants/app-info";
import { useDayBookStore } from "@/store/day-book-store";
import { Link } from "react-router-dom";

export function Footer() {
	const { updateSettings } = useDayBookStore();

	return (
		<footer className="text-muted-foreground mt-auto flex w-full justify-center">
			<div className="flex flex-col items-center justify-center gap-y-2">
				<div className="flex items-center justify-center gap-x-2 text-[0.8rem] font-medium">
					<Link
						to="/install"
						onClick={() => window.scrollTo(0, 0)}
						className="-m-3 p-3 transition-colors hover:text-slate-800 dark:hover:text-slate-200"
						title={`Install ${APP_INFO.name}`}
					>
						Install App
					</Link>
					<span className="text-muted-foreground/30">•</span>
					<button
						type="button"
						onClick={() => updateSettings({ onboardingStatus: "in_progress", onboardingStep: 0 })}
						className="-m-3 cursor-pointer p-3 transition-colors hover:text-slate-800 dark:hover:text-slate-200"
					>
						Take a tour
					</button>
					<span className="text-muted-foreground/30">•</span>
					<Link
						to="/about"
						onClick={() => window.scrollTo(0, 0)}
						className="-m-3 p-3 transition-colors hover:text-slate-800 dark:hover:text-slate-200"
						title={`About ${APP_INFO.name}`}
					>
						About {APP_INFO.name}
					</Link>
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
