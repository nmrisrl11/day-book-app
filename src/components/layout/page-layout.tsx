import React from "react";
import { Button } from "@/components/ui/button";
import { SettingsIcon, BookUser } from "lucide-react";
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
				<div
					className="flex cursor-pointer items-center gap-2 text-xl font-bold tracking-tight"
					onClick={() => setCurrentView?.("dashboard")}
				>
					<span className="text-primary text-2xl">🎉</span> DayBook
				</div>
				{setCurrentView && (
					<div className="flex items-center gap-2">
						<Button
							variant={currentView === "management" ? "secondary" : "ghost"}
							size="sm"
							onClick={() => setCurrentView("management")}
						>
							<BookUser className="mr-2 h-4 w-4" />
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
