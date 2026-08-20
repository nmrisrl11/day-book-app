import type { AvatarSettings } from "@/types/settings";

export const BORING_AVATARS_COLORS: string[] = [
	"#171717",
	"#262626",
	"#404040",
	"#737373",
	"#e5e5e5",
];

export const AVATAR_SETTINGS: AvatarSettings = {
	allowCustomUploads: true,
	defaultLibrary: "boring-avatars",
	avvvatarsStyle: "shape",
	boringAvatarsVariant: "beam",
	boringAvatarsColors: BORING_AVATARS_COLORS,
};
