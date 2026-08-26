import { RestoreDefaultsButton } from "@/components/restore-defaults-button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { INTERACTION_TYPES, SOUND_COLORS } from "@/constants/sounds-settings";
import { cn } from "@/lib/utils";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { play, sounds, type SoundName } from "cuelume";
import { useEffect, useState } from "react";

export function SoundSettingsSection() {
	const { settings, updateSettings } = useDayBookStore();
	const soundSettings = settings.soundSettings!;

	const [localVolume, setLocalVolume] = useState(soundSettings.volume);

	useEffect(() => {
		setLocalVolume(soundSettings.volume);
	}, [soundSettings.volume]);

	const handleRestore = () => {
		updateSettings({ soundSettings: defaultSettings.soundSettings });
	};

	const handleEnabledChange = (enabled: boolean) => {
		updateSettings({ soundSettings: { ...soundSettings, enabled } });
	};

	const handleVolumeChange = (value: number[]) => {
		setLocalVolume(value[0]);
		if (soundSettings.enabled) {
			play(soundSettings.mappings.press, { volume: value[0] });
		}
	};

	const handleVolumeCommit = (value: number[]) => {
		updateSettings({ soundSettings: { ...soundSettings, volume: value[0] } });
	};

	const handleMappingChange = (type: keyof typeof soundSettings.mappings, sound: SoundName) => {
		updateSettings({
			soundSettings: {
				...soundSettings,
				mappings: { ...soundSettings.mappings, [type]: sound },
			},
		});
	};

	const handlePreviewSound = (sound: SoundName) => {
		if (soundSettings.enabled) {
			play(sound, { volume: soundSettings.volume });
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="bg-card flex flex-col rounded-xl border">
				<div className="bg-muted/30 flex flex-col gap-1.5 rounded-t-xl border-b p-4">
					<div className="flex items-center justify-between gap-4">
						<h3 className="text-base font-semibold">Sound Settings</h3>
						<RestoreDefaultsButton
							onClick={handleRestore}
							ariaLabel="Restore default sound settings"
						/>
					</div>
					<p className="text-muted-foreground max-w-[85%] text-sm">
						Manage audio feedback and sound styles used throughout the app.
					</p>
				</div>

				<div className="flex flex-col px-4">
					<div className="flex flex-col gap-1 border-b py-4">
						<div className="flex items-center justify-between gap-4">
							<Label className="text-sm font-semibold" htmlFor="enable-sound">
								Enable Sound Effects
							</Label>
							<div className="flex shrink-0 items-center">
								<Switch
									id="enable-sound"
									checked={soundSettings.enabled}
									onCheckedChange={handleEnabledChange}
								/>
							</div>
						</div>
						<p className="text-muted-foreground max-w-[85%] text-sm">
							Play audio feedback for interactions like hovering over avatars or navigating back to
							the dashboard.
						</p>
					</div>

					{soundSettings.enabled && (
						<div className="flex flex-col gap-6 py-4">
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-semibold">Volume</h3>
									<span className="text-muted-foreground text-sm">
										{Math.round(localVolume * 100)}%
									</span>
								</div>
								<Slider
									id="master-volume"
									min={0}
									max={1}
									step={0.01}
									value={[localVolume]}
									onValueChange={handleVolumeChange}
									onValueCommit={handleVolumeCommit}
									disabled={!soundSettings.enabled}
									aria-label="Master volume"
								/>
							</div>

							<div className="space-y-3">
								<div className="mb-3 flex flex-col gap-1.5">
									<h3 className="text-sm font-semibold">Sound Customization</h3>
									<p className="text-muted-foreground text-sm">
										Choose which sound plays for different types of interactions.
									</p>
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									{INTERACTION_TYPES.map(({ id, label }) => (
										<div key={id} className="flex flex-col gap-2">
											<Label htmlFor={`sound-${id}`} className="text-sm">
												{label}
											</Label>
											<Select
												value={soundSettings.mappings[id]}
												onValueChange={(val) => handleMappingChange(id, val as SoundName)}
											>
												<SelectTrigger id={`sound-${id}`} className="w-full">
													<SelectValue placeholder="Select sound" />
												</SelectTrigger>
												<SelectContent position="popper">
													{sounds.map((sound) => (
														<SelectItem
															key={sound}
															value={sound}
															onPointerEnter={() => handlePreviewSound(sound)}
														>
															<div className="flex items-center gap-2">
																<div className={cn("h-2 w-2 rounded-full", SOUND_COLORS[sound])} />
																<span className="capitalize">{sound}</span>
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
