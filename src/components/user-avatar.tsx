import { AVATAR_SETTINGS, BORING_AVATARS_COLORS } from "@/constants/avatar-settings";
import { cn } from "@/lib/utils";
import { useDayBookStore } from "@/store/day-book-store";
import type { Birthday } from "@/types/birthday";
import { lazy, Suspense } from "react";

const Avvvatars = lazy(() => import("avvvatars-react"));
const BoringAvatar = lazy(() => import("boring-avatars"));

interface UserAvatarProps {
	birthday: Pick<Birthday, "name" | "avatar">;
	size?: number;
	className?: string;
}

export function UserAvatar({ birthday, size = 40, className }: UserAvatarProps) {
	// Fallback safely in case avatarSettings is missing from an old store state
	const avatarSettings =
		useDayBookStore((state) => state.settings.avatarSettings) || AVATAR_SETTINGS;

	// Custom uploaded image (Always show if it exists, even if uploads are disabled)
	if (birthday.avatar) {
		return (
			<img
				src={birthday.avatar}
				alt={`${birthday.name}'s avatar`}
				className={cn("rounded-full object-cover shrink-0", className)}
				style={!className?.includes("w-") ? { width: size, height: size } : undefined}
			/>
		);
	}

	// Boring Avatars
	if (avatarSettings.defaultLibrary === "boring-avatars") {
		return (
			<div
				className={cn(
					"flex shrink-0 items-center justify-center overflow-hidden rounded-full [&>svg]:h-full! [&>svg]:w-full!",
					className,
				)}
				style={!className?.includes("w-") ? { width: size, height: size } : undefined}
				aria-hidden="true"
			>
				<Suspense fallback={<div className="bg-muted h-full w-full animate-pulse rounded-full" />}>
					<BoringAvatar
						size={size}
						name={birthday.name}
						variant={avatarSettings.boringAvatarsVariant}
						colors={avatarSettings.boringAvatarsColors || BORING_AVATARS_COLORS}
					/>
				</Suspense>
			</div>
		);
	}

	// Avvvatars (Fallback / Default)
	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center [&>svg]:h-full! [&>svg]:w-full!",
				className,
			)}
			style={!className?.includes("w-") ? { width: size, height: size } : undefined}
			aria-hidden="true"
		>
			<Suspense fallback={<div className="bg-muted h-full w-full animate-pulse rounded-full" />}>
				<Avvvatars value={birthday.name} style={avatarSettings.avvvatarsStyle} size={size} />
			</Suspense>
		</div>
	);
}
