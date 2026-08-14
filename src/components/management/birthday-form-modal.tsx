import { useState, useEffect, useRef } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDayBook } from "@/context/day-book-context";
import type { Birthday } from "@/types/birthday";
import Avvvatars from "avvvatars-react";
import { CameraIcon, Trash2Icon } from "lucide-react";

interface BirthdayFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	birthday: Birthday | null;
}

export function BirthdayFormModal({ open, onOpenChange, birthday }: BirthdayFormModalProps) {
	const { addBirthday, editBirthday } = useDayBook();

	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [avatar, setAvatar] = useState<string | undefined>(undefined);
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			if (birthday) {
				setName(birthday.name);
				setDate(birthday.birthday);
				setAvatar(birthday.avatar);
			} else {
				setName("");
				setDate("");
				setAvatar(undefined);
			}
			setError("");
		}
	}, [open, birthday]);

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemoveAvatar = (e: React.MouseEvent) => {
		e.stopPropagation();
		setAvatar(undefined);
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
			setError("Only JPEG and PNG images are allowed.");
			return;
		}

		// Validate size (max 2MB)
		const maxSize = 2 * 1024 * 1024; // 2MB
		if (file.size > maxSize) {
			setError("Image size must be less than 2MB.");
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
					setAvatar(dataUrl);
					setError("");
				};
				img.src = event.target.result as string;
			}
		};
		reader.onerror = () => {
			setError("Failed to read the file.");
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const trimmedName = name.trim();

		if (!trimmedName) {
			setError("Name is required.");
			return;
		}
		if (trimmedName.length < 2) {
			setError("Name must be at least 2 characters.");
			return;
		}
		if (trimmedName.length > 50) {
			setError("Name must be less than 50 characters.");
			return;
		}
		if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
			setError("Name can only contain letters and spaces.");
			return;
		}

		if (!date) {
			setError("Birthday is required.");
			return;
		}

		// Basic validation for YYYY-MM-DD
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(date)) {
			setError("Invalid date format.");
			return;
		}

		if (birthday) {
			editBirthday({ ...birthday, name: trimmedName, birthday: date, avatar });
		} else {
			addBirthday({ name: trimmedName, birthday: date, avatar });
		}

		onOpenChange(false);
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

				<form id="birthday-form" onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
					<div className="flex flex-col items-center justify-center mb-2">
						<button 
							type="button"
							aria-label="Change avatar"
							className="relative group cursor-pointer flex items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-border hover:border-primary/50 transition-colors overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							onClick={handleAvatarClick}
						>
							{avatar ? (
								<img src={avatar} alt="Avatar preview" className="w-full h-full object-cover" />
							) : name.trim().length > 0 ? (
								<div className="[&>svg]:w-24 [&>svg]:h-24">
									<Avvvatars value={name.trim()} style="shape" size={96} />
								</div>
							) : (
								<div className="flex flex-col items-center justify-center text-muted-foreground">
									<CameraIcon className="w-8 h-8 opacity-50" />
								</div>
							)}
							
							{/* Hover overlay for changing image */}
							<div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<CameraIcon className="w-6 h-6 text-white mb-1" />
								<span className="text-white text-[10px] font-medium uppercase tracking-wider">Change</span>
							</div>
						</button>
						
						{avatar && (
							<Button 
								type="button"
								variant="ghost" 
								size="sm" 
								className="mt-2 h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" 
								onClick={handleRemoveAvatar}
							>
								<Trash2Icon className="w-3 h-3 mr-1.5" />
								Remove
							</Button>
						)}
						<Input 
							type="file" 
							accept="image/jpeg, image/jpg, image/png" 
							className="hidden" 
							ref={fileInputRef} 
							onChange={handleFileChange} 
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => {
								const val = e.target.value;
								// Only allow letters and spaces, or empty string
								if (/^[a-zA-Z\s]*$/.test(val)) {
									setName(val);
								}
							}}
							placeholder="e.g. John Doe"
							autoComplete="off"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="birthday">Birthday</Label>
						<Input
							id="birthday"
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="dark:scheme-dark"
						/>
					</div>

					{error && <p className="text-destructive text-sm font-medium">{error}</p>}
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
