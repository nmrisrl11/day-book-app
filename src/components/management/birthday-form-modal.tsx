import { useState, useEffect } from "react";
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

interface BirthdayFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	birthday: Birthday | null;
}

export function BirthdayFormModal({ open, onOpenChange, birthday }: BirthdayFormModalProps) {
	const { addBirthday, editBirthday } = useDayBook();

	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (open) {
			if (birthday) {
				setName(birthday.name);
				setDate(birthday.birthday);
			} else {
				setName("");
				setDate("");
			}
			setError("");
		}
	}, [open, birthday]);

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
			editBirthday({ ...birthday, name: trimmedName, birthday: date });
		} else {
			addBirthday({ name: trimmedName, birthday: date });
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
