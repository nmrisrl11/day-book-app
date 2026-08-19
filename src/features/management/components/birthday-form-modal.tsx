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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UserAvatar } from "@/components/user-avatar";
import { APP_INFO } from "@/constants/app-info";
import { birthdaySchema, type BirthdayFormData } from "@/schema/birthday-schema";
import {
	NAME_MAX_LENGTH,
	NAME_MIN_LENGTH,
	NOTE_MAX_COUNT,
	NOTE_MAX_LENGTH,
} from "@/schema/validation-constants";
import { useDayBookStore } from "@/store/day-book-store";
import type { Birthday } from "@/types/birthday";
import { RELATIONSHIP_OPTIONS } from "@/types/birthday";
import { zodResolver } from "@hookform/resolvers/zod";
import { play } from "cuelume";
import { CameraIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";

interface AvatarPreviewProps {
	control: Control<BirthdayFormData>;
	avatarSettings: { allowCustomUploads: boolean };
	onAvatarClick: () => void;
	onRemoveAvatar: (e: React.MouseEvent) => void;
}

function AvatarPreview({
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
							<CameraIcon className="h-8 w-8 opacity-50" />
						</div>
					)}

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
						onClick={onRemoveAvatar}
					>
						<Trash2Icon className="mr-1.5 h-3 w-3" />
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
	);
}

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
			relationship: "",
			notes: [],
		},
	});

	const [noteInput, setNoteInput] = useState("");
	const notes = useWatch({ control: form.control, name: "notes" }) || [];

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = form;

	useEffect(() => {
		if (open) {
			if (birthday) {
				reset({
					name: birthday.name,
					birthday: birthday.birthday,
					avatar: birthday.avatar || "",
					relationship: birthday.relationship || "",
					notes: birthday.notes || [],
				});
			} else {
				reset({
					name: "",
					birthday: "",
					avatar: "",
					relationship: "",
					notes: [],
				});
			}
			setNoteInput("");
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-sm">
				<DialogHeader className="border-b p-4 pb-2">
					<DialogTitle>{birthday ? "Edit Person" : "Add Person"}</DialogTitle>
					<DialogDescription>
						{birthday ? "Update the details below." : "Enter the details for this person."}
					</DialogDescription>
				</DialogHeader>

				<form
					id="birthday-form"
					onSubmit={handleSubmit(onSubmit, onError)}
					className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto p-4"
				>
					<div className="mb-2 flex flex-col items-center justify-center">
						<AvatarPreview
							control={form.control}
							avatarSettings={avatarSettings}
							onAvatarClick={handleAvatarClick}
							onRemoveAvatar={handleRemoveAvatar}
						/>
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
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							{...register("name")}
							placeholder="e.g. John"
							autoComplete="off"
							minLength={NAME_MIN_LENGTH}
							maxLength={NAME_MAX_LENGTH}
						/>
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
							autoComplete="off"
						/>
						{errors.birthday && (
							<p className="text-destructive text-sm font-medium" role="alert">
								{errors.birthday.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="relationship">Relationship</Label>
						<Controller
							control={form.control}
							name="relationship"
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger id="relationship" className="w-full">
										<SelectValue placeholder="Select relationship" />
									</SelectTrigger>
									<SelectContent position="popper">
										{RELATIONSHIP_OPTIONS.map((option) => (
											<SelectItem key={option} value={option}>
												{option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						{errors.relationship && (
							<p className="text-destructive text-sm font-medium" role="alert">
								{errors.relationship.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-2 pt-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="note">Notes (Optional)</Label>
							<span className="text-muted-foreground text-xs">
								{notes.length}/{NOTE_MAX_COUNT}
							</span>
						</div>

						{notes.length > 0 && (
							<div className="mb-2 flex flex-wrap gap-2">
								{notes.map((note, index) => (
									<div
										key={index}
										className="bg-primary/10 text-primary flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
									>
										<span>{note}</span>
										<button
											type="button"
											aria-label={`Remove note: ${note}`}
											onClick={() => {
												form.setValue(
													"notes",
													notes.filter((_, i) => i !== index),
													{ shouldValidate: true },
												);
											}}
											className="hover:bg-primary/20 rounded-full p-0.5"
										>
											<XIcon className="h-3 w-3" />
										</button>
									</div>
								))}
							</div>
						)}

						<div className="flex gap-2">
							<Input
								id="note"
								value={noteInput}
								onChange={(e) => setNoteInput(e.target.value)}
								placeholder="e.g. Loves painting"
								autoComplete="off"
								maxLength={NOTE_MAX_LENGTH}
								disabled={notes.length >= NOTE_MAX_COUNT}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										const trimmed = noteInput.trim();
										if (
											trimmed &&
											trimmed.length <= NOTE_MAX_LENGTH &&
											notes.length < NOTE_MAX_COUNT &&
											!notes.includes(trimmed)
										) {
											form.setValue("notes", [...notes, trimmed], { shouldValidate: true });
											setNoteInput("");
										}
									}
								}}
							/>
							<Button
								type="button"
								size="icon"
								variant="secondary"
								aria-label="Add note"
								className="shrink-0"
								disabled={notes.length >= NOTE_MAX_COUNT || !noteInput.trim()}
								onClick={(e) => {
									e.preventDefault();
									const trimmed = noteInput.trim();
									if (
										trimmed &&
										notes.length < NOTE_MAX_COUNT &&
										trimmed.length <= NOTE_MAX_LENGTH &&
										!notes.includes(trimmed)
									) {
										form.setValue("notes", [...notes, trimmed], { shouldValidate: true });
										setNoteInput("");
									}
								}}
							>
								<PlusIcon className="h-4 w-4" />
							</Button>
						</div>
						{errors.notes && (
							<p className="text-destructive text-sm font-medium" role="alert">
								{errors.notes.message}
							</p>
						)}
					</div>

					{generalError && (
						<p className="text-destructive text-sm font-medium" role="alert">
							{generalError}
						</p>
					)}
				</form>

				<DialogFooter className="m-0 rounded-none rounded-b-xl border-t p-4">
					<Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button type="submit" form="birthday-form">
						{birthday ? "Save Changes" : "Save Person"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
