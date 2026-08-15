export type AvatarLibrary = "avvvatars" | "boring-avatars";
export type AvvvatarsStyle = "character" | "shape";
export type BoringAvatarsVariant = "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus";

export interface AvatarSettings {
	allowCustomUploads: boolean;
	defaultLibrary: AvatarLibrary;
	avvvatarsStyle: AvvvatarsStyle;
	boringAvatarsVariant: BoringAvatarsVariant;
	boringAvatarsColors: string[];
}

export interface Settings {
	upcomingCount: number;
	theme: "light" | "dark";
	floatingMessages?: string[];
	greetings?: string[];
	avatarSettings?: AvatarSettings;
}
