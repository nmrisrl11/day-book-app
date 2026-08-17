import { Button } from "@/components/ui/button";
import { useDayBookStore } from "@/store/day-book-store";
import { MoonIcon, SunIcon } from "lucide-react";
import { Kbd } from "../ui/kbd";

export function ThemeSection() {
	const { settings, updateSettings } = useDayBookStore();

	return (
		<div className="flex flex-col gap-3">
			<h3 className="flex items-center gap-2 text-base font-medium">
				Theme <Kbd>Alt + T</Kbd>
			</h3>
			<div className="flex gap-3">
				<Button
					variant={settings.theme === "light" ? "default" : "outline"}
					onClick={() => updateSettings({ theme: "light" })}
					className="flex-1"
					aria-label="Switch to light theme"
				>
					<SunIcon className="mr-2 h-4 w-4" />
					Light
				</Button>
				<Button
					variant={settings.theme === "dark" ? "default" : "outline"}
					onClick={() => updateSettings({ theme: "dark" })}
					className="flex-1"
					aria-label="Switch to dark theme"
				>
					<MoonIcon className="mr-2 h-4 w-4" />
					Dark
				</Button>
			</div>
		</div>
	);
}
