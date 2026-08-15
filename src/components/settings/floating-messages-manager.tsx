import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { CheckIcon, Edit2Icon, PlusIcon, RotateCcwIcon, Trash2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { Kbd } from "../ui/kbd";

export function FloatingMessagesManager() {
	const { settings, updateSettings } = useDayBookStore();
	const messages = settings.floatingMessages || [];
	const [newMessage, setNewMessage] = useState("");
	const [error, setError] = useState("");

	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editText, setEditText] = useState("");

	const handleAdd = () => {
		const trimmed = newMessage.trim();
		if (trimmed.length < 2) {
			setError("Message must be at least 2 characters.");
			return;
		}
		if (trimmed.length > 50) {
			setError("Message cannot exceed 50 characters.");
			return;
		}
		if (messages.includes(trimmed)) {
			setError("This message already exists.");
			return;
		}
		if (messages.length >= 10) {
			setError("Maximum of 10 messages reached.");
			return;
		}

		updateSettings({ floatingMessages: [...messages, trimmed] });
		setNewMessage("");
		setError("");
	};

	const handleDelete = (index: number) => {
		setEditingIndex(null);
		setEditText("");
		const newMessages = messages.filter((_, i) => i !== index);
		updateSettings({ floatingMessages: newMessages });
		setError("");
	};

	const handleClearAll = () => {
		updateSettings({ floatingMessages: [] });
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
			setError("Message must be at least 2 characters.");
			return;
		}
		if (trimmed.length > 50) {
			setError("Message cannot exceed 50 characters.");
			return;
		}
		// If it's the exact same text, just cancel edit
		if (trimmed === messages[index]) {
			cancelEdit();
			return;
		}
		if (messages.some((msg, i) => i !== index && msg === trimmed)) {
			setError("This message already exists.");
			return;
		}

		const newMessages = [...messages];
		newMessages[index] = trimmed;
		updateSettings({ floatingMessages: newMessages });
		cancelEdit();
	};

	const handleRestoreDefaults = () => {
		if (defaultSettings.floatingMessages) {
			updateSettings({ floatingMessages: defaultSettings.floatingMessages });
			setError("");
			setEditingIndex(null);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-medium">Floating Messages</h3>
					<div className="flex gap-2">
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-foreground h-8 text-xs"
							onClick={handleRestoreDefaults}
							aria-label="Restore default floating messages"
						>
							<RotateCcwIcon className="h-3 w-3 sm:mr-1.5" />
							<span className="hidden sm:inline">Restore Defaults</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 text-xs"
							onClick={handleClearAll}
							disabled={messages.length === 0}
							aria-label="Clear all floating messages"
						>
							<Trash2Icon className="h-3 w-3 sm:mr-1.5" />
							<span className="hidden sm:inline">Clear All</span>
						</Button>
					</div>
				</div>
				<p className="text-muted-foreground text-sm">
					Manage the messages that float across the screen when someone has a birthday. <br />(
					<span className="font-bold">Tip:</span> You can use emojis with your system keyboard:{" "}
					<Kbd>Win + .</Kbd> or <Kbd>Cmd + Ctrl + Space</Kbd>)
				</p>
			</div>

			<div className="flex flex-wrap gap-2">
				{messages.map((msg, index) => (
					<div key={index} className="flex items-center">
						{editingIndex === index ? (
							<div className="border-primary/50 bg-background focus-within:ring-ring flex items-center gap-1 rounded-full border py-1 pr-1 pl-3 shadow-sm transition-all focus-within:ring-2">
								<Input
									autoFocus
									maxLength={50}
									id={`edit-floating-msg-${index}`}
									className="h-6 w-32 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0"
									value={editText}
									onChange={(e) => setEditText(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") saveEdit(index);
										if (e.key === "Escape") cancelEdit();
									}}
								/>
								<div className="flex shrink-0">
									<Button
										size="icon"
										variant="ghost"
										className="h-6 w-6 rounded-full text-green-600 hover:bg-green-100/50 hover:text-green-700 dark:hover:bg-green-900/30"
										onClick={() => saveEdit(index)}
										aria-label="Save"
									>
										<CheckIcon className="h-3.5 w-3.5" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										className="text-muted-foreground h-6 w-6 rounded-full"
										onClick={cancelEdit}
										aria-label="Cancel"
									>
										<XIcon className="h-3.5 w-3.5" />
									</Button>
								</div>
							</div>
						) : (
							<Badge
								variant="secondary"
								className="bg-secondary/80 hover:bg-secondary h-8 gap-1 py-1 pr-1 pl-3 text-sm"
							>
								<span>{msg}</span>
								<div className="ml-1 flex shrink-0">
									<Button
										size="icon"
										variant="ghost"
										className="h-6 w-6 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
										onClick={() => startEdit(index, msg)}
										aria-label={`Edit floating message: ${msg.substring(0, 20)}`}
									>
										<Edit2Icon className="h-3 w-3" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										className={cn(
											"hover:bg-destructive/20 hover:text-destructive h-6 w-6 rounded-full",
											messages.length <= 1 && "cursor-not-allowed opacity-50",
										)}
										onClick={() => handleDelete(index)}
										disabled={messages.length <= 1}
										aria-label={`Delete floating message: ${msg.substring(0, 20)}`}
									>
										<Trash2Icon className="h-3 w-3" />
									</Button>
								</div>
							</Badge>
						)}
					</div>
				))}
			</div>

			<div className="mt-2 flex flex-col gap-2 border-t pt-2">
				{messages.length < 10 ? (
					<div className="flex flex-col gap-2">
						<Label htmlFor="new-floating-message" className="text-sm font-medium">
							Add New Message
						</Label>
						<div className="flex items-center gap-2">
							<Input
								id="new-floating-message"
								maxLength={50}
								placeholder="Add a new message... (min 2, max 50 chars)"
								value={newMessage}
								onChange={(e) => {
									setNewMessage(e.target.value);
									if (error) setError("");
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter") handleAdd();
								}}
								className="max-w-sm"
							/>
							<Button onClick={handleAdd} size="sm" aria-label="Add floating message">
								<PlusIcon className="mr-1 h-4 w-4" />
								Add
							</Button>
						</div>
					</div>
				) : (
					<p className="text-sm font-medium text-amber-600">Maximum of 10 messages reached.</p>
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
