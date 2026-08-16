import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/user-avatar";
import { birthdaySchema, type BirthdayFormData } from "@/schema/birthday-schema";
import { useDayBookStore } from "@/store/day-book-store";
import type { Birthday } from "@/types/birthday";
import { zodResolver } from "@hookform/resolvers/zod";
import { play } from "cuelume";

import { CameraIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface BirthdayFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	birthday: Birthday | null;
}

export function BirthdayFormModal({ open, onOpenChange, birthday }: BirthdayFormModalProps) {
	const { addBirthday, editBirthday } = useDayBookStore();
	const [generalError, setGeneralError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<BirthdayFormData>({
		resolver: zodResolver(birthdaySchema),
		defaultValues: {
			name: "",
			birthday: "",
			avatar: "",
		},
	});

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = form;

	const avatar = watch("avatar");
	const name = watch("name");
	const date = watch("birthday");

	useEffect(() => {
		if (open) {
			if (birthday) {
				reset({
					name: birthday.name,
					birthday: birthday.birthday,
					avatar: birthday.avatar || "",
				});
			} else {
				reset({
					name: "",
					birthday: "",
					avatar: "",
				});
			}
			setGeneralError("");
		}
	}, [open, birthday, reset]);

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemoveAvatar = (e: React.MouseEvent) => {
		e.stopPropagation();
		setValue("avatar", "", { shouldValidate: true });
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate type
		const validTypes = ["image/jpeg", "image/jpg", "image/png"];
		if (!validTypes.includes(file.type)) {
			onError();
			setGeneralError("Only JPEG and PNG images are allowed.");
			return;
		}

		// Validate size (max 2MB)
		const maxSize = 2 * 1024 * 1024; // 2MB
		if (file.size > maxSize) {
			onError();
			setGeneralError("Image size must be less than 2MB.");
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			if (event.target?.result) {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement("canvas");
					const MAX_SIZE = 400;
					let width = img.width;
					let height = img.height;

					if (width > height && width > MAX_SIZE) {
						height *= MAX_SIZE / width;
						width = MAX_SIZE;
					} else if (height > MAX_SIZE) {
						width *= MAX_SIZE / height;
						height = MAX_SIZE;
					}

					canvas.width = width;
					canvas.height = height;
					const ctx = canvas.getContext("2d");
					ctx?.drawImage(img, 0, 0, width, height);

					const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
					setValue("avatar", dataUrl, { shouldValidate: true });
					setGeneralError("");
				};
				img.src = event.target.result as string;
			}
		};
		reader.onerror = () => {
			onError();
			setGeneralError("Failed to read the file.");
		};
		reader.readAsDataURL(file);
	};

	const soundSettings = useDayBookStore((state) => state.settings.soundSettings);

	const onSubmit = (data: BirthdayFormData) => {
		const finalData = { ...data, avatar: data.avatar || undefined };
		if (birthday) {
			editBirthday({ ...birthday, ...finalData });
		} else {
			addBirthday(finalData);
		}

		if (soundSettings?.enabled) {
			play(soundSettings.mappings.success, { volume: soundSettings.volume });
		}

		onOpenChange(false);
	};

	const onError = () => {
		if (soundSettings?.enabled) {
			play(soundSettings.mappings.error, { volume: soundSettings.volume });
		}
	};

	const avatarSettings = useDayBookStore((state) => state.settings.avatarSettings) || {
		allowCustomUploads: true,
	};

	// Create a dummy Birthday object for previewing the avatar.
	// The preview will use the selected generated-avatar library when custom uploads are disabled,
	// or the currently selected avatar string if it exists.
	const previewBirthday: Birthday = {
		id: "preview",
		name: name || "DayBook",
		birthday: date || "2000-01-01",
		avatar: avatar,
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{birthday ? "Edit Birthday" : "Add Birthday"}</DialogTitle>
					<DialogDescription>
						{birthday ? "Update the details below." : "Enter the details for the new birthday."}
					</DialogDescription>
				</DialogHeader>

				<form
					id="birthday-form"
					onSubmit={handleSubmit(onSubmit, onError)}
					className="flex flex-col gap-4 py-4"
				>
					<div className="mb-2 flex flex-col items-center justify-center">
						{avatarSettings.allowCustomUploads ? (
							<>
								<button
									type="button"
									aria-label="Change avatar"
									className="group border-border hover:border-primary/50 focus-visible:ring-ring relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors focus:outline-none focus-visible:ring-2"
									onClick={handleAvatarClick}
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
											<CameraIcon className="h-8 w-8 opacity-50" />
										</div>
									)}

									{/* Hover overlay for changing image */}
									<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
										<CameraIcon className="mb-1 h-6 w-6 text-white" />
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
										onClick={handleRemoveAvatar}
									>
										<Trash2Icon className="mr-1.5 h-3 w-3" />
										Remove
									</Button>
								)}
								<Input
									id="avatar-upload"
									name="avatar-upload"
									type="file"
									accept="image/jpeg, image/jpg, image/png"
									className="hidden"
									ref={fileInputRef}
									onChange={handleFileChange}
									aria-label="Upload Avatar"
								/>
							</>
						) : (
							<div className="flex flex-col items-center justify-center">
								<UserAvatar birthday={previewBirthday} size={96} />
								{avatar && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-2 h-7 text-xs"
										onClick={handleRemoveAvatar}
									>
										<Trash2Icon className="mr-1.5 h-3 w-3" />
										Remove
									</Button>
								)}
								<p className="text-muted-foreground mt-3 max-w-62.5 text-center text-xs">
									{avatar
										? "Custom profile image uploads are disabled. You can still remove your existing image."
										: "Custom profile images are disabled. This generated avatar will be used instead."}
								</p>
							</div>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" {...register("name")} placeholder="e.g. John" autoComplete="off" />
						{errors.name && (
							<p className="text-destructive text-sm font-medium" role="alert">
								{errors.name.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="birthday">Birthday</Label>
						<Input
							id="birthday"
							type="date"
							{...register("birthday")}
							className="dark:scheme-dark"
						/>
						{errors.birthday && (
							<p className="text-destructive text-sm font-medium" role="alert">
								{errors.birthday.message}
							</p>
						)}
					</div>

					{generalError && (
						<p className="text-destructive text-sm font-medium" role="alert">
							{generalError}
						</p>
					)}
				</form>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button type="submit" form="birthday-form">
						{birthday ? "Save Changes" : "Add Birthday"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
