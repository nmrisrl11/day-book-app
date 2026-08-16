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
import { RotateCcw } from "lucide-react";

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
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 rounded-lg border p-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1 pr-6">
						<Label className="text-base font-semibold" htmlFor="allow-custom-uploads">
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

			<div className="flex flex-col gap-6 rounded-lg border p-4 md:flex-row">
				<div className="flex flex-1 flex-col gap-4">
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<h3 className="text-base font-semibold">Default Avatar Library</h3>
								<span className="text-muted-foreground mb-1 text-sm">
									Choose which library generates avatars when no custom image is available.
								</span>
							</div>
							<Button variant="outline" size="sm" onClick={handleRestoreDefaults}>
								<RotateCcw className="mr-2 h-4 w-4" />
								Restore
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
						<div className="flex flex-col gap-2">
							<Label className="font-semibold" htmlFor="avvvatars-style">
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
												<Avvvatars value="Jane Doe" style="shape" size={24} />
											</div>
											<span>Shape</span>
										</div>
									</SelectItem>
									<SelectItem value="character">
										<div className="flex items-center gap-3">
											<div className="h-6 w-6">
												<Avvvatars value="Jane Doe" style="character" size={24} />
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
							<div className="flex flex-col gap-2">
								<Label className="font-semibold" htmlFor="boring-avatars-variant">
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
															name="Jane Doe"
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

							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between">
									<p className="text-sm font-semibold">Colors</p>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 px-2 text-xs"
										onClick={() => {
											const currentColors = avatarSettings.boringAvatarsColors?.join(",") || "";
											const randomPalette = getRandomPalette(currentColors);
											updateSettings({
												avatarSettings: { ...avatarSettings, boringAvatarsColors: randomPalette },
											});
										}}
									>
										Randomize Palette
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

				<div className="flex min-w-32 shrink-0 flex-col items-center justify-center gap-3 border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
					<p className="text-muted-foreground text-xs tracking-wider uppercase">Preview</p>
					<div className="bg-muted ring-border rounded-full p-2 shadow-sm ring-1">
						<UserAvatar
							// Using 'Jane Doe' so it clearly represents a user
							birthday={{ name: "Jane Doe" }}
							size={80}
							className="h-20 w-20"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
