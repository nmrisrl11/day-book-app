import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AVATAR_SETTINGS, BORING_AVATARS_COLORS } from "@/constants/avatar-settings";
import { getRandomPalette } from "@/helpers/color-palettes";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import type { AvatarLibrary, AvvvatarsStyle, BoringAvatarsVariant } from "@/types/settings";
import { DicesIcon } from "lucide-react";
import { RestoreDefaultsButton } from "@/components/restore-defaults-button";

export function QuickActionAvatar() {
	const { settings, updateSettings } = useDayBookStore();
	const avatarSettings = settings.avatarSettings || AVATAR_SETTINGS;

	const handleLibraryChange = (value: AvatarLibrary) => {
		updateSettings({ avatarSettings: { ...avatarSettings, defaultLibrary: value } });
	};

	const handleAvvvatarsStyleChange = (value: AvvvatarsStyle) => {
		updateSettings({ avatarSettings: { ...avatarSettings, avvvatarsStyle: value } });
	};

	const handleBoringAvatarsVariantChange = (value: BoringAvatarsVariant) => {
		updateSettings({ avatarSettings: { ...avatarSettings, boringAvatarsVariant: value } });
	};

	const randomizeColors = () => {
		const currentColors = (avatarSettings.boringAvatarsColors || BORING_AVATARS_COLORS).join(",");
		const randomPalette = getRandomPalette(currentColors);
		updateSettings({
			avatarSettings: { ...avatarSettings, boringAvatarsColors: randomPalette },
		});
	};

	const restoreDefault = () => {
		updateSettings({ avatarSettings: defaultSettings.avatarSettings });
	};

	return (
		<div className="flex w-full flex-col gap-3 p-3 md:min-w-50">
			<div className="flex items-center justify-between">
				<h4 className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
					Avatar
				</h4>
				<div className="flex items-center gap-1">
					<RestoreDefaultsButton iconOnly onClick={restoreDefault} />
					{avatarSettings.defaultLibrary === "boring-avatars" && (
						<Button
							variant="ghost"
							size="icon"
							className="hover:bg-muted h-6 w-6 rounded-full"
							onClick={randomizeColors}
							title="Randomize Colors"
							aria-label="Randomize palette"
						>
							<DicesIcon className="text-muted-foreground h-3.5 w-3.5" />
						</Button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-2 md:grid-cols-1">
				<Select value={avatarSettings.defaultLibrary} onValueChange={handleLibraryChange}>
					<SelectTrigger className="h-8 w-full px-2.5 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectItem value="avvvatars">Avvvatars</SelectItem>
						<SelectItem value="boring-avatars">Boring Avatars</SelectItem>
					</SelectContent>
				</Select>

				{avatarSettings.defaultLibrary === "avvvatars" && (
					<Select value={avatarSettings.avvvatarsStyle} onValueChange={handleAvvvatarsStyleChange}>
						<SelectTrigger className="h-8 w-full px-2.5 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectItem value="shape">Shape</SelectItem>
							<SelectItem value="character">Character</SelectItem>
						</SelectContent>
					</Select>
				)}

				{avatarSettings.defaultLibrary === "boring-avatars" && (
					<Select
						value={avatarSettings.boringAvatarsVariant}
						onValueChange={handleBoringAvatarsVariantChange}
					>
						<SelectTrigger className="h-8 w-full px-2.5 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectItem value="marble">Marble</SelectItem>
							<SelectItem value="beam">Beam</SelectItem>
							<SelectItem value="pixel">Pixel</SelectItem>
							<SelectItem value="sunset">Sunset</SelectItem>
							<SelectItem value="ring">Ring</SelectItem>
							<SelectItem value="bauhaus">Bauhaus</SelectItem>
						</SelectContent>
					</Select>
				)}
			</div>
		</div>
	);
}
