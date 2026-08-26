import { RestoreDefaultsButton } from "@/components/restore-defaults-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { MinusIcon, PlusIcon } from "lucide-react";

export function DisplaySettingsSection() {
	const { settings, updateSettings } = useDayBookStore();
	const upcomingCount = settings.upcomingCount || defaultSettings.upcomingCount;

	const handleDecrement = () => {
		if (upcomingCount > 1) {
			updateSettings({ upcomingCount: upcomingCount - 1 });
		}
	};

	const handleIncrement = () => {
		if (upcomingCount < 10) {
			updateSettings({ upcomingCount: upcomingCount + 1 });
		}
	};

	return (
		<div className="bg-card flex flex-col rounded-xl border">
			<div className="bg-muted/30 rounded-t-xl border-b p-4">
				<h3 className="text-base font-semibold">Dashboard & Display</h3>
				<p className="text-muted-foreground text-sm">
					Manage how content and effects are displayed on your dashboard.
				</p>
			</div>
			<div className="flex flex-col px-4">
				<div className="flex flex-col gap-2 border-b py-4">
					<div className="flex items-center justify-between gap-4">
						<Label className="text-sm font-semibold" id="upcoming-count-label">
							Upcoming Birthdays Display Count
						</Label>
						<RestoreDefaultsButton
							onClick={() => updateSettings({ upcomingCount: defaultSettings.upcomingCount })}
							ariaLabel="Restore display defaults"
						/>
					</div>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-muted-foreground text-sm sm:max-w-[85%]">
							Choose how many upcoming birthdays to show on the dashboard.
						</p>
						<div className="flex shrink-0 items-center">
							<div className="bg-muted flex items-center rounded-lg border p-1 shadow-sm">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 rounded-md"
									onClick={handleDecrement}
									disabled={upcomingCount <= 1}
									aria-label="Decrease count"
								>
									<MinusIcon className="h-4 w-4" />
								</Button>
								<div
									className="flex w-12 items-center justify-center font-medium tabular-nums select-none"
									aria-labelledby="upcoming-count-label"
									aria-live="polite"
								>
									{upcomingCount}
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 rounded-md"
									onClick={handleIncrement}
									disabled={upcomingCount >= 10}
									aria-label="Increase count"
								>
									<PlusIcon className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-1 border-b py-4">
					<div className="flex items-center justify-between gap-4">
						<Label className="text-sm font-semibold" htmlFor="enable-animations">
							Enable Animations & Effects
						</Label>
						<div className="flex shrink-0 items-center">
							<Switch
								id="enable-animations"
								checked={settings.animationsEnabled ?? true}
								onCheckedChange={(checked) => updateSettings({ animationsEnabled: checked })}
							/>
						</div>
					</div>
					<p className="text-muted-foreground max-w-[85%] text-sm">
						Play confetti and other visual effects. Turn this off if you prefer reduced motion.
					</p>
				</div>

				<div className="flex flex-col gap-1 py-4">
					<div className="flex items-center justify-between gap-4">
						<Label className="text-sm font-semibold" htmlFor="enable-quick-actions">
							Show Quick Action Toolbar
						</Label>
						<div className="flex shrink-0 items-center">
							<Switch
								id="enable-quick-actions"
								checked={settings.quickActionsEnabled ?? true}
								onCheckedChange={(checked) => updateSettings({ quickActionsEnabled: checked })}
							/>
						</div>
					</div>
					<p className="text-muted-foreground max-w-[85%] text-sm">
						Show a floating toolbar on the dashboard for quick access to avatar and greeting
						customization.
					</p>
				</div>
			</div>
		</div>
	);
}
