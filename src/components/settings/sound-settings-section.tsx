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
import { INTERACTION_TYPES, SOUND_COLORS } from "@/constants/sounds";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { play, sounds, type SoundName } from "cuelume";
import { RestoreDefaultsButton } from "./restore-defaults-button";

export function SoundSettingsSection() {
	const { settings, updateSettings } = useDayBookStore();
	const soundSettings = settings.soundSettings!;

	const handleRestore = () => {
		updateSettings({ soundSettings: defaultSettings.soundSettings });
	};

	const handleEnabledChange = (enabled: boolean) => {
		updateSettings({ soundSettings: { ...soundSettings, enabled } });
	};

	const handleVolumeChange = (value: number[]) => {
		updateSettings({ soundSettings: { ...soundSettings, volume: value[0] } });
		if (soundSettings.enabled) {
			play(soundSettings.mappings.press, { volume: value[0] });
		}
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
		<div className="flex flex-col gap-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-medium">Sounds & Feedback</h3>
					<p className="text-muted-foreground text-sm">
						Manage interaction sounds and audio feedback.
					</p>
				</div>
				<RestoreDefaultsButton
					onClick={handleRestore}
					title="Restore sound defaults"
					ariaLabel="Restore sound defaults"
				/>
			</div>

			<div className="flex flex-col gap-6">
				{/* Global Enable/Disable */}
				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="interaction-sounds" className="text-base">
							Enable Interaction Sounds
						</Label>
						<p className="text-muted-foreground text-sm">
							Play audio feedback for buttons, switches, and notifications.
						</p>
					</div>
					<Switch
						id="interaction-sounds"
						checked={soundSettings.enabled}
						onCheckedChange={handleEnabledChange}
					/>
				</div>

				{soundSettings.enabled && (
					<div className="flex flex-col gap-6">
						{/* Volume Slider */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label id="volume-label" className="text-base">
									Volume
								</Label>
								<span className="text-muted-foreground text-sm">
									{Math.round(soundSettings.volume * 100)}%
								</span>
							</div>
							<Slider
								aria-labelledby="volume-label"
								min={0}
								max={1}
								step={0.01}
								value={[soundSettings.volume]}
								onValueChange={handleVolumeChange}
								className="py-4"
							/>
						</div>

						<div className="my-2 border-t" />

						{/* Custom Mappings */}
						<div className="space-y-4">
							<div className="mb-4 space-y-0.5">
								<Label className="text-base">Sound Customization</Label>
								<p className="text-muted-foreground text-sm">
									Choose which sound plays for different types of interactions.
								</p>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								{INTERACTION_TYPES.map(({ id, label }) => (
									<div key={id} className="flex flex-col gap-2">
										<Label htmlFor={`sound-${id}`} className="text-sm font-medium">
											{label}
										</Label>
										<Select
											value={soundSettings.mappings[id]}
											onValueChange={(val) => handleMappingChange(id, val as SoundName)}
										>
											<SelectTrigger id={`sound-${id}`}>
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
															<div className={`h-2 w-2 rounded-full ${SOUND_COLORS[sound]}`} />
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
	);
}
