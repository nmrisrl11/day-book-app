import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDayBook } from "@/context/day-book-context";
import { Edit2Icon, PlusIcon, Trash2Icon, XIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function GreetingsManager() {
	const { settings, updateSettings } = useDayBook();
	const greetings = settings.greetings || [];
	const [newGreeting, setNewGreeting] = useState("");
	const [error, setError] = useState("");

	// Edit state
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editText, setEditText] = useState("");

	const handleAdd = () => {
		const trimmed = newGreeting.trim();
		if (!trimmed) {
			setError("Greeting cannot be empty.");
			return;
		}
		if (greetings.includes(trimmed)) {
			setError("This greeting already exists.");
			return;
		}
		if (greetings.length >= 10) {
			setError("Maximum of 10 greetings reached.");
			return;
		}

		updateSettings({ greetings: [...greetings, trimmed] });
		setNewGreeting("");
		setError("");
	};

	const handleDelete = (index: number) => {
		if (greetings.length <= 1) {
			setError("You must have at least one greeting.");
			return;
		}
		setEditingIndex(null);
		setEditText("");
		const newGreetings = greetings.filter((_, i) => i !== index);
		updateSettings({ greetings: newGreetings });
		setError("");
	};

	const startEdit = (index: number, currentText: string) => {
		setEditingIndex(index);
		setEditText(currentText);
		setError("");
	};

	const cancelEdit = () => {
		setEditingIndex(null);
		setEditText("");
		setError("");
	};

	const saveEdit = (index: number) => {
		const trimmed = editText.trim();
		if (!trimmed) {
			setError("Greeting cannot be empty.");
			return;
		}
		// If it's the exact same text, just cancel edit
		if (trimmed === greetings[index]) {
			cancelEdit();
			return;
		}
		if (greetings.some((msg, i) => i !== index && msg === trimmed)) {
			setError("This greeting already exists.");
			return;
		}

		const newGreetings = [...greetings];
		newGreetings[index] = trimmed;
		updateSettings({ greetings: newGreetings });
		cancelEdit();
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Label className="text-base font-medium">Greetings</Label>
				<p className="text-muted-foreground text-sm">
					Manage the birthday wishes that appear when you open a celebrant's special day.
				</p>
			</div>

			<div className="flex flex-col gap-3">
				{greetings.map((msg, index) => (
					<div
						key={index}
						className="bg-card hover:border-primary/30 flex flex-col rounded-xl border p-4 shadow-sm transition-all"
					>
						{editingIndex === index ? (
							<div className="flex flex-col gap-3">
								<Textarea
									autoFocus
									className="min-h-20"
									value={editText}
									onChange={(e) => setEditText(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											saveEdit(index);
										}
										if (e.key === "Escape") cancelEdit();
									}}
								/>
								<div className="flex justify-end gap-2">
									<Button size="sm" variant="ghost" onClick={cancelEdit}>
										<XIcon className="mr-2 h-4 w-4" />
										Cancel
									</Button>
									<Button size="sm" onClick={() => saveEdit(index)}>
										<CheckIcon className="mr-2 h-4 w-4" />
										Save
									</Button>
								</div>
							</div>
						) : (
							<div className="flex justify-between gap-4">
								<p className="flex-1 text-sm leading-relaxed font-medium whitespace-pre-wrap">
									{msg}
								</p>
								<div className="flex shrink-0 flex-col gap-1 sm:flex-row">
									<Button
										size="icon"
										variant="ghost"
										className="h-8 w-8 rounded-full"
										onClick={() => startEdit(index, msg)}
										aria-label="Edit"
									>
										<Edit2Icon className="h-4 w-4" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										className={cn(
											"hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-full",
											greetings.length <= 1 && "cursor-not-allowed opacity-50",
										)}
										onClick={() => handleDelete(index)}
										disabled={greetings.length <= 1}
										aria-label="Delete"
									>
										<Trash2Icon className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			<div className="mt-2 flex flex-col gap-3 border-t pt-2">
				{greetings.length < 10 ? (
					<div className="flex flex-col gap-2">
						<Label className="text-sm font-medium">Add New Greeting</Label>
						<Textarea
							placeholder="Write a warm birthday wish..."
							value={newGreeting}
							onChange={(e) => {
								setNewGreeting(e.target.value);
								if (error) setError("");
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleAdd();
								}
							}}
							className="min-h-20"
						/>
						<Button onClick={handleAdd} className="w-fit">
							<PlusIcon className="mr-2 h-4 w-4" />
							Add Greeting
						</Button>
					</div>
				) : (
					<p className="text-sm font-medium text-amber-600 dark:text-amber-400">
						Maximum of 10 greetings reached.
					</p>
				)}

				{error && <p className="text-destructive text-sm font-medium">{error}</p>}
			</div>
		</div>
	);
}
