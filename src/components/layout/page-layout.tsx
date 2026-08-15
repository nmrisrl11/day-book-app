import { Button } from "@/components/ui/button";
import { BookUser, SettingsIcon } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface PageLayoutProps {
	children: React.ReactNode;
}

const NAV_ITEMS = [
	{ name: "Birthdays", path: "/manage", icon: BookUser },
	{ name: "Settings", path: "/settings", icon: SettingsIcon, isIcon: true },
];

export function PageLayout({ children }: PageLayoutProps) {
	const location = useLocation();

	return (
		<div className="bg-background text-foreground relative flex min-h-screen flex-col overflow-x-hidden font-sans">
			<header className="relative z-20 mx-auto flex w-full max-w-4xl items-center justify-between p-4 md:px-4 md:py-6">
				<Link
					to="/"
					className="group focus-visible:ring-primary flex cursor-pointer items-center gap-2 rounded-md p-1 focus:outline-none focus-visible:ring-2"
					title="Go to Dashboard"
				>
					<img
						src="/logo.png"
						alt="DayBook Logo"
						title="DayBook Logo"
						className="h-12 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
					/>
					<span className="text-primary hidden text-2xl font-bold sm:inline">DayBook</span>
				</Link>
				<div className="flex items-center gap-2">
					{NAV_ITEMS.map((item) => {
						const isActive =
							location.pathname === item.path || location.pathname.startsWith(item.path + "/");
						const Icon = item.icon;

						return item.isIcon ? (
							<Button
								key={item.path}
								variant={isActive ? "secondary" : "ghost"}
								size="icon-sm"
								asChild
								title={item.name}
							>
								<Link
									to={item.path}
									title={item.name}
									aria-label={item.name}
									aria-current={isActive ? "page" : undefined}
								>
									<Icon />
								</Link>
							</Button>
						) : (
							<Button key={item.path} variant={isActive ? "secondary" : "ghost"} size="sm" asChild>
								<Link to={item.path} title={item.name} aria-current={isActive ? "page" : undefined}>
									<Icon className="h-4 w-4 sm:mr-2" />
									<span className="hidden sm:inline">{item.name}</span>
								</Link>
							</Button>
						);
					})}
				</div>
			</header>

			<main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-4 py-4 md:gap-16 md:py-6">
				{children}
			</main>
		</div>
	);
}
