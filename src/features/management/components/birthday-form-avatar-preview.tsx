import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { APP_INFO } from "@/constants/app-info";
import type { BirthdayFormInput } from "@/schema/birthday-schema";
import type { Birthday } from "@/types/birthday";
import { CameraIcon, Trash2Icon } from "lucide-react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";

interface AvatarPreviewProps {
	control: Control<BirthdayFormInput>;
	avatarSettings: { allowCustomUploads: boolean };
	onAvatarClick: () => void;
	onRemoveAvatar: (e: React.MouseEvent) => void;
}

export function AvatarPreview({
	control,
	avatarSettings,
	onAvatarClick,
	onRemoveAvatar,
}: AvatarPreviewProps) {
	const avatar = useWatch({ control, name: "avatar" });
	const name = useWatch({ control, name: "name" });
	const date = useWatch({ control, name: "birthday" });

	const previewBirthday: Birthday = {
		id: "preview",
		name: name || APP_INFO.name,
		birthday: date || "2000-01-01",
		avatar: avatar,
		relationship: "Other",
		notes: [],
		giftIdeas: [],
	};

	if (avatarSettings.allowCustomUploads) {
		return (
			<>
				<button
					type="button"
					aria-label="Change avatar"
					className="group border-border hover:border-primary/50 focus-visible:ring-ring relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors focus:outline-none focus-visible:ring-2"
					onClick={onAvatarClick}
				>
					{avatar ? (
						<img
							src={avatar}
							alt="Avatar preview"
							title="Avatar preview"
							className="h-full w-full object-cover"
						/>
					) : name?.trim().length > 0 ? (
						<div className="h-24 w-24">
							<UserAvatar birthday={previewBirthday} size={96} className="h-full w-full" />
						</div>
					) : (
						<div className="text-muted-foreground flex flex-col items-center justify-center">
							<CameraIcon className="h-8 w-8 opacity-50" aria-hidden="true" />
						</div>
					)}

					<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
						<CameraIcon className="mb-1 h-6 w-6 text-white" aria-hidden="true" />
						<span className="text-[10px] font-medium tracking-wider text-white uppercase">
							Change
						</span>
					</div>
				</button>

				{avatar && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-2 h-7 text-xs"
						onClick={onRemoveAvatar}
					>
						<Trash2Icon className="mr-1.5 h-3 w-3" aria-hidden="true" />
						Remove
					</Button>
				)}
			</>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<UserAvatar birthday={previewBirthday} size={96} />
			{avatar && (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-2 h-7 text-xs"
					onClick={onRemoveAvatar}
				>
					<Trash2Icon className="mr-1.5 h-3 w-3" aria-hidden="true" />
					Remove
				</Button>
			)}
			<p className="text-muted-foreground mt-3 max-w-62.5 text-center text-xs">
				{avatar
					? "Custom profile image uploads are disabled. You can still remove your existing image."
					: "Custom profile images are disabled. This generated avatar will be used instead."}
			</p>
		</div>
	);
}
