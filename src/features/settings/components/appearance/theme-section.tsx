import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { useDayBookStore } from "@/store/day-book-store";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeSection() {
	const { settings, updateSettings } = useDayBookStore();

	return (
		<div className="bg-card flex flex-col rounded-xl border">
			<div className="bg-muted/30 flex flex-col gap-1.5 rounded-t-xl border-b p-4">
				<h3 className="flex items-center gap-2 text-base font-semibold">
					Theme <Kbd className="ml-1">Alt + T</Kbd>
				</h3>
				<p className="text-muted-foreground text-sm">Choose between light and dark mode.</p>
			</div>
			<div className="flex flex-col p-4">
				<div className="bg-muted/50 flex w-full rounded-lg p-1">
					<Button
						variant={settings.theme === "light" ? "default" : "ghost"}
						onClick={() => updateSettings({ theme: "light" })}
						className={cn("flex-1", settings.theme === "light" && "shadow-sm")}
						aria-label="Switch to light theme"
					>
						<SunIcon className="mr-2 h-4 w-4" />
						Light
					</Button>
					<Button
						variant={settings.theme === "dark" ? "default" : "ghost"}
						onClick={() => updateSettings({ theme: "dark" })}
						className={cn("flex-1", settings.theme === "dark" && "shadow-sm")}
						aria-label="Switch to dark theme"
					>
						<MoonIcon className="mr-2 h-4 w-4" />
						Dark
					</Button>
				</div>
			</div>
		</div>
	);
}
