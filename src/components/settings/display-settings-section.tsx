import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDayBookStore } from "@/store/day-book-store";

export function DisplaySettingsSection() {
	const { settings, updateSettings } = useDayBookStore();

	const handleUpcomingCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.valueAsNumber;
		if (Number.isInteger(val) && val >= 1 && val <= 10) {
			updateSettings({ upcomingCount: val });
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-3">
				<Label htmlFor="upcoming-count" className="text-base">
					Upcoming Birthdays Display Count
				</Label>
				<p className="text-muted-foreground text-sm">
					Choose how many upcoming birthdays to show on the dashboard.
				</p>
				<Input
					id="upcoming-count"
					name="upcoming-count"
					type="number"
					min={1}
					max={10}
					step="1"
					value={settings.upcomingCount}
					onChange={handleUpcomingCountChange}
				/>
			</div>

			<div className="flex items-center justify-between">
				<div className="space-y-0.5">
					<Label className="text-base" htmlFor="enable-animations">
						Enable Animations & Effects
					</Label>
					<p className="text-muted-foreground text-sm">
						Play confetti and other visual effects. Turn this off if you prefer reduced motion.
					</p>
				</div>
				<Switch
					id="enable-animations"
					checked={settings.animationsEnabled ?? true}
					onCheckedChange={(checked) => updateSettings({ animationsEnabled: checked })}
				/>
			</div>
		</div>
	);
}
