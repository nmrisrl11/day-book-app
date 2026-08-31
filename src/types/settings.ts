export type AvatarLibrary = "avvvatars" | "boring-avatars";
export type AvvvatarsStyle = "character" | "shape";
export type BoringAvatarsVariant = "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus";
export type SoundName =
	| "chime"
	| "sparkle"
	| "droplet"
	| "bloom"
	| "whisper"
	| "tick"
	| "press"
	| "release"
	| "toggle"
	| "success"
	| "error"
	| "page"
	| "loading"
	| "ready"
	| "pulse"
	| "scan"
	| "arrival";
export type GreetingTextColorType = "solid" | "gradient";
export type OnboardingStatus = "not_started" | "in_progress" | "completed" | "dismissed";
export type QuickActionsPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface AvatarSettings {
	allowCustomUploads: boolean;
	defaultLibrary: AvatarLibrary;
	avvvatarsStyle: AvvvatarsStyle;
	boringAvatarsVariant: BoringAvatarsVariant;
	boringAvatarsColors: string[];
}

export interface SoundSettings {
	enabled: boolean;
	volume: number;
	mappings: {
		hover: SoundName;
		press: SoundName;
		toggle: SoundName;
		success: SoundName;
		error: SoundName;
	};
}

export interface GreetingTextSettings {
	text: string;
	fontFamily?: string;
	type: GreetingTextColorType;
	solidColor: string;
	gradient: {
		start: string;
		end: string;
		direction: string;
	};
}

export interface Settings {
	upcomingCount: number;
	theme: "light" | "dark";
	floatingMessages?: string[];
	customGreetingsEnabled?: boolean;
	greetings?: string[];
	avatarSettings?: AvatarSettings;
	soundSettings?: SoundSettings;
	animationsEnabled?: boolean;
	greetingTextSettings?: GreetingTextSettings;
	onboardingStatus?: OnboardingStatus;
	onboardingStep?: number;
	quickActionsEnabled?: boolean;
	quickActionsPosition?: QuickActionsPosition;
	quickActionsIsOpen?: boolean;
	lastBackupDate?: string;
	lastBackupReminderDismissedAt?: string;
	lastInstallPromptDismissedAt?: string;
}
