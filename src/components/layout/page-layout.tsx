import { Button } from "@/components/ui/button";
import { BookUser, SettingsIcon } from "lucide-react";
import React from "react";
import { SettingsModal } from "../settings/settings-modal";

interface PageLayoutProps {
	children: React.ReactNode;
	currentView?: "dashboard" | "management";
	setCurrentView?: (view: "dashboard" | "management") => void;
}

export function PageLayout({ children, currentView, setCurrentView }: PageLayoutProps) {
	const [settingsOpen, setSettingsOpen] = React.useState(false);

	return (
		<div className="bg-background text-foreground relative flex min-h-screen flex-col overflow-x-hidden font-sans">
			<header className="relative z-20 mx-auto flex w-full max-w-4xl items-center justify-between p-4 md:px-4 md:py-6">
				<button
					type="button"
					className="group focus-visible:ring-primary flex cursor-pointer items-center gap-2 rounded-md p-1 focus:outline-none focus-visible:ring-2"
					onClick={() => setCurrentView?.("dashboard")}
				>
					<img
						src="/logo.png"
						alt="DayBook Logo"
						className="h-12 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
					/>
					<span className="text-primary hidden text-2xl font-bold sm:inline">DayBook</span>
				</button>
				{setCurrentView && (
					<div className="flex items-center gap-2">
						<Button
							variant={currentView === "management" ? "secondary" : "ghost"}
							size="sm"
							onClick={() => setCurrentView("management")}
						>
							<BookUser className="h-4 w-4 sm:mr-2" />
							<span className="hidden sm:inline">Birthdays</span>
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => setSettingsOpen(true)}
							title="Settings"
						>
							<SettingsIcon />
						</Button>
					</div>
				)}
			</header>

			<main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-4 py-4 md:gap-16 md:py-6">
				{children}
			</main>

			<SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
		</div>
	);
}
