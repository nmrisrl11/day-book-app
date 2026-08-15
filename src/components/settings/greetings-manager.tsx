import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { CheckIcon, Edit2Icon, PlusIcon, RotateCcwIcon, Trash2Icon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

export function GreetingsManager() {
	const { settings, updateSettings } = useDayBookStore();
	const greetings = settings.greetings || [];
	const [newGreeting, setNewGreeting] = useState("");
	const [error, setError] = useState("");
	const newGreetingRef = useRef<HTMLTextAreaElement>(null);

	// Edit state
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editText, setEditText] = useState("");

	const handleAdd = () => {
		const trimmed = newGreeting.trim();
		if (trimmed.length < 2) {
			setError("Greeting must be at least 2 characters.");
			return;
		}
		if (trimmed.length > 200) {
			setError("Greeting cannot exceed 200 characters.");
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
		if (newGreetingRef.current) {
			newGreetingRef.current.style.height = "auto";
			newGreetingRef.current.style.overflowY = "hidden";
		}
	};

	const handleDelete = (index: number) => {
		setEditingIndex(null);
		setEditText("");
		const newGreetings = greetings.filter((_, i) => i !== index);
		updateSettings({ greetings: newGreetings });
		setError("");
	};

	const handleClearAll = () => {
		updateSettings({ greetings: [] });
		setError("");
		setEditingIndex(null);
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
		if (trimmed.length < 2) {
			setError("Greeting must be at least 2 characters.");
			return;
		}
		if (trimmed.length > 200) {
			setError("Greeting cannot exceed 200 characters.");
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

	const handleRestoreDefaults = () => {
		if (defaultSettings.greetings) {
			updateSettings({ greetings: defaultSettings.greetings });
			setError("");
			setEditingIndex(null);
		}
	};

	const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = "auto";
		e.target.style.height = `${e.target.scrollHeight}px`;

		// If it exceeds the max height (128px for max-h-32), it should scroll
		if (e.target.scrollHeight > 128) {
			e.target.style.overflowY = "auto";
		} else {
			e.target.style.overflowY = "hidden";
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-medium">Greetings</h3>
					<div className="flex gap-2">
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-foreground h-8 text-xs"
							onClick={handleRestoreDefaults}
							aria-label="Restore default greetings"
						>
							<RotateCcwIcon className="h-3 w-3 sm:mr-1.5" />
							<span className="hidden sm:inline">Restore Defaults</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 text-xs"
							onClick={handleClearAll}
							disabled={greetings.length === 0}
							aria-label="Clear all greetings"
						>
							<Trash2Icon className="h-3 w-3 sm:mr-1.5" />
							<span className="hidden sm:inline">Clear All</span>
						</Button>
					</div>
				</div>
				<p className="text-muted-foreground text-sm">
					Manage the birthday wishes that appear when you open a celebrant's special day.
				</p>
			</div>

			<div className="border-border bg-card flex flex-col divide-y overflow-hidden rounded-xl border">
				{greetings.map((msg, index) => (
					<div key={index} className="hover:bg-muted/30 flex flex-col p-3 transition-colors">
						{editingIndex === index ? (
							<div className="flex flex-col gap-2">
								<Textarea
									autoFocus
									maxLength={200}
									id={`edit-greeting-${index}`}
									className="max-h-32 min-h-12 w-full resize-none overflow-hidden text-sm"
									value={editText}
									onChange={(e) => {
										setEditText(e.target.value);
										adjustTextareaHeight(e);
									}}
									onFocus={adjustTextareaHeight}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											saveEdit(index);
										}
										if (e.key === "Escape") cancelEdit();
									}}
								/>
								<div className="flex justify-end gap-2">
									<Button
										size="sm"
										variant="ghost"
										onClick={cancelEdit}
										aria-label="Cancel editing"
									>
										<XIcon className="mr-1 h-3 w-3" />
										Cancel
									</Button>
									<Button size="sm" onClick={() => saveEdit(index)} aria-label="Save greeting">
										<CheckIcon className="mr-1 h-3 w-3" />
										Save
									</Button>
								</div>
							</div>
						) : (
							<div className="flex items-center justify-between gap-4">
								<p className="flex-1 py-1 text-sm leading-relaxed whitespace-pre-wrap">{msg}</p>
								<div className="flex shrink-0 gap-1">
									<Button
										size="icon"
										variant="ghost"
										className="h-8 w-8 rounded-full"
										onClick={() => startEdit(index, msg)}
										aria-label={`Edit greeting: ${msg.substring(0, 20)}`}
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
										aria-label={`Delete greeting: ${msg.substring(0, 20)}`}
									>
										<Trash2Icon className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			<div className="mt-1 flex flex-col gap-3">
				{greetings.length < 10 ? (
					<div className="flex flex-col gap-2">
						<Label htmlFor="new-greeting" className="text-sm font-medium">
							Add New Greeting
						</Label>
						<Textarea
							ref={newGreetingRef}
							id="new-greeting"
							maxLength={200}
							placeholder="Write a warm birthday wish (min 2, max 200 characters)..."
							value={newGreeting}
							onChange={(e) => {
								setNewGreeting(e.target.value);
								adjustTextareaHeight(e);
								if (error) setError("");
							}}
							onFocus={adjustTextareaHeight}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleAdd();
								}
							}}
							className="max-h-32 min-h-12 resize-none overflow-hidden text-sm"
						/>
						<Button onClick={handleAdd} className="w-fit" aria-label="Add new greeting">
							<PlusIcon className="mr-2 h-4 w-4" />
							Add Greeting
						</Button>
					</div>
				) : (
					<p className="text-sm font-medium text-amber-600">Maximum of 10 greetings reached.</p>
				)}

				{error && (
					<p className="text-destructive text-sm font-medium" role="alert">
						{error}
					</p>
				)}
			</div>
		</div>
	);
}
