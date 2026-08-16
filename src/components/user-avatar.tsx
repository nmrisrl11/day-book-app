import { BORING_AVATARS_DEFAULT_COLORS } from "@/constants/default-colors";
import { cn } from "@/lib/utils";
import { useDayBookStore } from "@/store/day-book-store";
import type { Birthday } from "@/types/birthday";
import Avvvatars from "avvvatars-react";
import BoringAvatar from "boring-avatars";

interface UserAvatarProps {
	birthday: Pick<Birthday, "name" | "avatar">;
	size?: number;
	className?: string;
}

export function UserAvatar({ birthday, size = 40, className }: UserAvatarProps) {
	// Fallback safely in case avatarSettings is missing from an old store state
	const avatarSettings = useDayBookStore((state) => state.settings.avatarSettings) || {
		allowCustomUploads: true,
		defaultLibrary: "avvvatars",
		avvvatarsStyle: "shape",
		boringAvatarsVariant: "beam",
		boringAvatarsColors: BORING_AVATARS_DEFAULT_COLORS,
	};

	// 1. Custom uploaded image (Always show if it exists, even if uploads are disabled)
	if (birthday.avatar) {
		return (
			<img
				src={birthday.avatar}
				alt={`${birthday.name}'s avatar`}
				className={cn("rounded-full object-cover", className)}
				style={!className?.includes("w-") ? { width: size, height: size } : undefined}
			/>
		);
	}

	// 2. Boring Avatars
	if (avatarSettings.defaultLibrary === "boring-avatars") {
		return (
			<div
				className={cn(
					"flex shrink-0 items-center justify-center overflow-hidden rounded-full [&>svg]:h-full [&>svg]:w-full",
					className,
				)}
				style={!className?.includes("w-") ? { width: size, height: size } : undefined}
			>
				<BoringAvatar
					size={size}
					name={birthday.name}
					variant={avatarSettings.boringAvatarsVariant}
					colors={avatarSettings.boringAvatarsColors || BORING_AVATARS_DEFAULT_COLORS}
				/>
			</div>
		);
	}

	// 3. Avvvatars (Fallback / Default)
	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full",
				className,
			)}
			style={!className?.includes("w-") ? { width: size, height: size } : undefined}
		>
			<Avvvatars value={birthday.name} style={avatarSettings.avvvatarsStyle} size={size} />
		</div>
	);
}
