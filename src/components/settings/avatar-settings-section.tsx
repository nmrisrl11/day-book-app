import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserAvatar } from "@/components/user-avatar";
import { BORING_AVATARS_DEFAULT_COLORS } from "@/constants/default-colors";
import { getRandomPalette } from "@/helpers/color-palettes";
import { useDayBookStore } from "@/store/day-book-store";
import type { AvatarLibrary, AvvvatarsStyle, BoringAvatarsVariant } from "@/types/settings";
import Avvvatars from "avvvatars-react";
import BoringAvatar from "boring-avatars";
import { RotateCcw, Dices } from "lucide-react";

export function AvatarSettingsSection() {
	const { settings, updateSettings } = useDayBookStore();
	const avatarSettings = settings.avatarSettings || {
		allowCustomUploads: true,
		defaultLibrary: "avvvatars",
		avvvatarsStyle: "shape",
		boringAvatarsVariant: "beam",
		boringAvatarsColors: BORING_AVATARS_DEFAULT_COLORS,
	};

	const handleToggleCustomUploads = (checked: boolean) => {
		updateSettings({ avatarSettings: { ...avatarSettings, allowCustomUploads: checked } });
	};

	const handleLibraryChange = (value: AvatarLibrary) => {
		updateSettings({ avatarSettings: { ...avatarSettings, defaultLibrary: value } });
	};

	const handleAvvvatarsStyleChange = (value: AvvvatarsStyle) => {
		updateSettings({ avatarSettings: { ...avatarSettings, avvvatarsStyle: value } });
	};

	const handleBoringAvatarsVariantChange = (value: BoringAvatarsVariant) => {
		updateSettings({ avatarSettings: { ...avatarSettings, boringAvatarsVariant: value } });
	};

	const handleRestoreDefaults = () => {
		updateSettings({
			avatarSettings: {
				...avatarSettings,
				defaultLibrary: "avvvatars",
				avvvatarsStyle: "shape",
				boringAvatarsVariant: "beam",
				boringAvatarsColors: BORING_AVATARS_DEFAULT_COLORS,
			},
		});
	};

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1 pr-6">
						<Label className="text-base font-medium" htmlFor="allow-custom-uploads">
							Allow Custom Profile Images
						</Label>
						<span className="text-muted-foreground text-sm">
							Enable this if you want to upload your own custom profile images for birthdays. Please
							note that uploaded images are processed and stored locally in your browser, which may
							increase the application's storage and memory usage. Enable this only if you need it.
						</span>
					</div>
					<Switch
						id="allow-custom-uploads"
						checked={avatarSettings.allowCustomUploads}
						onCheckedChange={handleToggleCustomUploads}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-6 md:flex-row">
				<div className="flex flex-1 flex-col gap-4">
					<div className="flex flex-col gap-3">
						<div className="flex items-start justify-between">
							<div className="flex flex-col gap-1 pr-6">
								<h3 className="text-base font-medium">Default Avatar Library</h3>
								<span className="text-muted-foreground text-sm">
									Choose which library generates avatars when no custom image is available.
								</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleRestoreDefaults}
								className="shrink-0 px-2 md:px-3"
								aria-label="Restore avatar defaults"
							>
								<RotateCcw className="h-4 w-4 md:mr-2" />
								<span className="hidden md:inline">Restore</span>
							</Button>
						</div>
						<Select value={avatarSettings.defaultLibrary} onValueChange={handleLibraryChange}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectItem value="avvvatars">Avvvatars</SelectItem>
								<SelectItem value="boring-avatars">Boring Avatars</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{avatarSettings.defaultLibrary === "avvvatars" && (
						<div className="flex flex-col gap-3">
							<Label className="text-sm font-medium" htmlFor="avvvatars-style">
								Avatar Style
							</Label>
							<Select
								value={avatarSettings.avvvatarsStyle}
								onValueChange={handleAvvvatarsStyleChange}
							>
								<SelectTrigger className="h-auto w-full py-2" id="avvvatars-style">
									<SelectValue />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="shape">
										<div className="flex items-center gap-3">
											<div className="h-6 w-6">
												<Avvvatars value="DayBook" style="shape" size={24} />
											</div>
											<span>Shape</span>
										</div>
									</SelectItem>
									<SelectItem value="character">
										<div className="flex items-center gap-3">
											<div className="h-6 w-6">
												<Avvvatars value="DayBook" style="character" size={24} />
											</div>
											<span>Character</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}

					{avatarSettings.defaultLibrary === "boring-avatars" && (
						<>
							<div className="flex flex-col gap-3">
								<Label className="text-sm font-medium" htmlFor="boring-avatars-variant">
									Variant
								</Label>
								<Select
									value={avatarSettings.boringAvatarsVariant}
									onValueChange={handleBoringAvatarsVariantChange}
								>
									<SelectTrigger className="h-auto w-full py-2" id="boring-avatars-variant">
										<SelectValue />
									</SelectTrigger>
									<SelectContent position="popper">
										{(
											[
												"marble",
												"beam",
												"pixel",
												"sunset",
												"ring",
												"bauhaus",
											] as BoringAvatarsVariant[]
										).map((variant) => (
											<SelectItem key={variant} value={variant}>
												<div className="flex items-center gap-3">
													<div className="flex items-center justify-center overflow-hidden rounded-full [&>svg]:h-full! [&>svg]:w-full!">
														<BoringAvatar
															size={24}
															name="DayBook"
															variant={variant}
															colors={
																avatarSettings.boringAvatarsColors || BORING_AVATARS_DEFAULT_COLORS
															}
														/>
													</div>
													<span className="capitalize">{variant}</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col gap-3">
								<div className="flex items-center justify-between">
									<Label className="text-sm font-medium">Colors</Label>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 shrink-0 px-2 text-xs md:px-3"
										aria-label="Randomize palette"
										onClick={() => {
											const currentColors = (
												avatarSettings.boringAvatarsColors || BORING_AVATARS_DEFAULT_COLORS
											).join(",");
											const randomPalette = getRandomPalette(currentColors);
											updateSettings({
												avatarSettings: { ...avatarSettings, boringAvatarsColors: randomPalette },
											});
										}}
									>
										<Dices className="h-4 w-4 md:mr-2" />
										<span className="hidden md:inline">Randomize Palette</span>
									</Button>
								</div>
								<div className="flex items-center gap-2">
									{(avatarSettings.boringAvatarsColors || BORING_AVATARS_DEFAULT_COLORS).map(
										(color, index) => (
											<div
												key={index}
												className="ring-border relative h-8 w-8 overflow-hidden rounded-full shadow-sm ring-1"
											>
												<input
													type="color"
													value={color}
													onChange={(e) => {
														const newColors = [
															...(avatarSettings.boringAvatarsColors ||
																BORING_AVATARS_DEFAULT_COLORS),
														];
														newColors[index] = e.target.value;
														updateSettings({
															avatarSettings: { ...avatarSettings, boringAvatarsColors: newColors },
														});
													}}
													className="absolute -top-2 -left-2 h-12 w-12 cursor-pointer border-0 p-0"
													aria-label={`Color ${index + 1}`}
												/>
											</div>
										),
									)}
								</div>
							</div>
						</>
					)}
				</div>

				<div className="flex min-w-32 shrink-0 flex-col items-center justify-center gap-4 border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
					<p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
						Preview
					</p>
					<div className="bg-muted ring-border rounded-full p-2 shadow-sm ring-1">
						<UserAvatar birthday={{ name: "DayBook" }} size={80} className="h-20 w-20" />
					</div>
				</div>
			</div>
		</div>
	);
}
