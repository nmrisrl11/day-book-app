import { Logo } from "@/components/icons/logos/logo";
import { NotificationMenu } from "@/components/notifications/notification-menu";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSearchStore } from "@/store/search-store";
import { BookUserIcon, HomeIcon, LinkIcon, SearchIcon, SettingsIcon } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";

interface PageLayoutProps {
	children: React.ReactNode;
}

type NavItem = {
	name: string;
	path: string;
	icon: React.ElementType;
	isIcon: boolean;
	variant?: VariantProps<typeof buttonVariants>["variant"];
};

const NAV_ITEMS: NavItem[] = [
	{ name: "Birthdays", path: "/manage", icon: BookUserIcon, isIcon: true },
	{ name: "Invitations", path: "/invitations", icon: LinkIcon, isIcon: true },
	{ name: "Settings", path: "/settings", icon: SettingsIcon, isIcon: true },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
	{ name: "Home", path: "/", icon: HomeIcon, isIcon: true },
	...NAV_ITEMS,
];

export function PageLayout({ children }: PageLayoutProps) {
	const location = useLocation();
	const toggleSearch = useSearchStore((state) => state.toggle);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return (
		<div className="bg-background text-foreground relative flex min-h-dvh flex-col overflow-x-clip font-sans pb-20 md:pb-0">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4 focus:text-foreground"
			>
				Skip to main content
			</a>
			<header className="relative z-20 mx-auto flex w-full max-w-4xl items-center justify-between p-4 md:px-4 md:py-6">
				<Link
					to="/"
					className="group focus-visible:ring-primary flex cursor-pointer items-center gap-2 rounded-md p-1 focus:outline-none focus-visible:ring-2"
					title="Go to Dashboard"
				>
					<Logo className="text-foreground h-12 w-auto drop-shadow-sm transition-transform duration-200 group-hover:scale-105" />
				</Link>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						title="Search (⌘K)"
						onClick={toggleSearch}
						id="global-search-trigger"
					>
						<SearchIcon aria-hidden="true" />
					</Button>
					<NotificationMenu />
					{isDesktop &&
						NAV_ITEMS.map((item) => {
							const isActive =
								location.pathname === item.path ||
								(item.path !== "/" && location.pathname.startsWith(item.path + "/"));
							const Icon = item.icon;

							if (item.isIcon) {
								return (
									<Button
										key={item.path}
										variant={isActive ? "secondary" : "ghost"}
										size="icon"
										asChild
										title={item.name}
									>
										<Link
											to={item.path}
											title={item.name}
											aria-label={item.name}
											aria-current={isActive ? "page" : undefined}
										>
											<Icon aria-hidden="true" />
										</Link>
									</Button>
								);
							}

							return (
								<Button
									key={item.path}
									variant={isActive ? "secondary" : item.variant || "ghost"}
									size="default"
									asChild
								>
									<Link
										to={item.path}
										title={item.name}
										aria-current={isActive ? "page" : undefined}
									>
										<Icon className="mr-2 h-4 w-4" aria-hidden="true" />
										<span className="inline">{item.name}</span>
									</Link>
								</Button>
							);
						})}
				</div>
			</header>

			<main
				id="main-content"
				className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-4 py-4 md:gap-16 md:py-6"
			>
				{children}
			</main>

			{!isDesktop && (
				<nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background/80 px-2 py-2 pb-[env(safe-area-inset-bottom,16px)] backdrop-blur-md">
					{MOBILE_NAV_ITEMS.map((item) => {
						const isActive =
							location.pathname === item.path ||
							(item.path !== "/" && location.pathname.startsWith(item.path + "/"));
						const Icon = item.icon;

						return (
							<Link
								key={item.path}
								to={item.path}
								title={item.name}
								aria-label={item.name}
								aria-current={isActive ? "page" : undefined}
								className={`flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors ${
									isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
								}`}
							>
								<Icon className="h-6 w-6" aria-hidden="true" />
								<span className="text-[10px] font-medium">{item.name}</span>
							</Link>
						);
					})}
				</nav>
			)}
		</div>
	);
}
