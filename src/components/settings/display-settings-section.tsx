import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDragScroll } from "@/hooks/use-drag-scroll";
import { cn } from "@/lib/utils";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { useEffect, useState } from "react";
import { RestoreDefaultsButton } from "./restore-defaults-button";

export function DisplaySettingsSection() {
	const { settings, updateSettings } = useDayBookStore();

	const { isDragging, handlers } = useDragScroll();
	const [localCount, setLocalCount] = useState(settings.upcomingCount.toString());

	useEffect(() => {
		setLocalCount(settings.upcomingCount.toString());
	}, [settings.upcomingCount]);

	const handleUpcomingCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setLocalCount(val);

		const parsed = parseInt(val, 10);
		if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
			updateSettings({ upcomingCount: parsed });
		}
	};

	const handleCommitCount = () => {
		const parsed = parseInt(localCount, 10);
		if (isNaN(parsed) || parsed < 1 || parsed > 10) {
			setLocalCount(settings.upcomingCount.toString());
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 rounded-xl border p-3">
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between">
						<Label htmlFor="upcoming-count" className="text-base">
							Upcoming Birthdays Display Count
						</Label>
						<RestoreDefaultsButton
							onClick={() => updateSettings({ upcomingCount: defaultSettings.upcomingCount })}
							ariaLabel="Restore display defaults"
						/>
					</div>

					<p className="text-muted-foreground text-sm">
						Choose how many upcoming birthdays to show on the dashboard.
					</p>
				</div>

				<Input
					id="upcoming-count"
					type="number"
					min={1}
					max={10}
					step="1"
					value={localCount}
					onChange={handleUpcomingCountChange}
					onBlur={handleCommitCount}
				/>

				<div className="w-full overflow-x-auto rounded-xl mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] whitespace-nowrap [&::-webkit-scrollbar]:hidden">
					<div
						className={cn(
							"flex w-max space-x-4 p-4 pt-8 pb-4 select-none",
							isDragging ? "cursor-grabbing" : "cursor-grab",
						)}
						{...handlers}
					>
						{Array.from({ length: Math.max(1, Math.min(10, settings.upcomingCount || 5)) }).map(
							(_, i) => (
								<div
									key={i}
									className="animate-in fade-in zoom-in-95 fill-mode-both border-border bg-card flex min-w-28 flex-col items-center rounded-2xl border p-3 shadow-sm duration-300 md:min-w-32"
									style={{ animationDelay: `${i * 50}ms` }}
								>
									<div className="bg-background ring-border relative -mt-8 mb-3 rounded-full p-1 shadow-sm ring-1">
										<div className="bg-primary/20 h-10 w-10 rounded-full md:h-12 md:w-12" />
									</div>
									<div className="flex w-full flex-col items-center gap-1.5 text-center">
										<div className="bg-primary/20 h-3 w-16 rounded-full md:w-20" />
										<div className="bg-primary/10 h-2 w-12 rounded-full md:w-16" />
										<div className="bg-primary/10 mt-0.5 h-4 w-20 rounded-full md:w-24" />
									</div>
								</div>
							),
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-1.5 rounded-xl border p-3">
				<div className="flex items-center justify-between">
					<Label className="text-base" htmlFor="enable-animations">
						Enable Animations & Effects
					</Label>

					<Switch
						id="enable-animations"
						checked={settings.animationsEnabled ?? true}
						onCheckedChange={(checked) => updateSettings({ animationsEnabled: checked })}
					/>
				</div>

				<p className="text-muted-foreground text-sm">
					Play confetti and other visual effects. Turn this off if you prefer reduced motion.
				</p>
			</div>
		</div>
	);
}
