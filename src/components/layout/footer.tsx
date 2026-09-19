import { AnimateIcon } from "@/components/ui/animate-icon";
import { BotIcon } from "@/components/ui/animated-icons/bot-icon";
import { APP_INFO } from "@/constants/app-info";
import { useDayBookStore } from "@/store/day-book-store";
import { Fragment } from "react";
import { Link } from "react-router-dom";

type FooterItem =
	| {
			type: "link";
			label: string;
			to: string;
			title?: string;
	  }
	| {
			type: "button";
			label: string;
			onClick: () => void;
	  };

export function Footer() {
	const { updateSettings } = useDayBookStore();

	const footerItems: FooterItem[] = [
		{
			type: "link",
			label: "Sync Data",
			to: "/settings?tab=data",
			title: "Import or Sync Data",
		},
		{
			type: "link",
			label: "Install App",
			to: "/install",
			title: `Install ${APP_INFO.name}`,
		},
		{
			type: "button",
			label: "Take a tour",
			onClick: () => updateSettings({ onboardingStatus: "in_progress", onboardingStep: 0 }),
		},
		{
			type: "link",
			label: `About ${APP_INFO.name}`,
			to: "/about",
			title: `About ${APP_INFO.name}`,
		},
	];

	return (
		<footer className="mt-auto flex w-full justify-center text-muted-foreground">
			<div className="flex flex-col items-center justify-center gap-y-2">
				<div className="flex flex-wrap items-center justify-center gap-x-2 text-center text-[0.8rem] font-medium">
					{footerItems.map((item, index) => {
						const commonClasses =
							"-m-3 p-3 transition-colors hover:text-slate-800 dark:hover:text-slate-200";

						return (
							<Fragment key={item.label}>
								{item.type === "link" ? (
									<Link
										to={item.to}
										onClick={() => window.scrollTo(0, 0)}
										className={commonClasses}
										title={item.title}
									>
										{item.label}
									</Link>
								) : (
									<button
										type="button"
										onClick={item.onClick}
										className={`${commonClasses} cursor-pointer`}
									>
										{item.label}
									</button>
								)}
								{index < footerItems.length - 1 && (
									<span className="text-muted-foreground/30">•</span>
								)}
							</Fragment>
						);
					})}
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
