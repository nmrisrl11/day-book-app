import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDayBook } from "@/context/day-book-context";
import { Edit2Icon, PlusIcon, Trash2Icon, XIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingMessagesManager() {
	const { settings, updateSettings } = useDayBook();
	const messages = settings.floatingMessages || [];
	const [newMessage, setNewMessage] = useState("");
	const [error, setError] = useState("");
	
	// Edit state
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editText, setEditText] = useState("");

	const handleAdd = () => {
		const trimmed = newMessage.trim();
		if (!trimmed) {
			setError("Message cannot be empty.");
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
		if (messages.length <= 1) {
			setError("You must have at least one floating message.");
			return;
		}
		const newMessages = messages.filter((_, i) => i !== index);
		updateSettings({ floatingMessages: newMessages });
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
			setError("Message cannot be empty.");
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

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Label className="text-base font-medium">Floating Messages</Label>
				<p className="text-muted-foreground text-sm">
					Manage the messages that float across the screen when someone has a birthday. 
					(Tip: You can use emojis with your system keyboard: Win + . or Cmd + Ctrl + Space)
				</p>
			</div>

			<div className="flex flex-wrap gap-2">
				{messages.map((msg, index) => (
					<div key={index} className="flex items-center">
						{editingIndex === index ? (
							<div className="flex items-center gap-1 rounded-full border border-primary/50 bg-background pl-3 pr-1 py-1 shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring">
								<Input
									autoFocus
									className="h-6 w-32 border-0 px-0 py-0 text-sm focus-visible:ring-0 shadow-none bg-transparent"
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
										className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-100/50 dark:hover:bg-green-900/30 rounded-full" 
										onClick={() => saveEdit(index)}
										aria-label="Save"
									>
										<CheckIcon className="h-3.5 w-3.5" />
									</Button>
									<Button 
										size="icon" 
										variant="ghost" 
										className="h-6 w-6 text-muted-foreground rounded-full" 
										onClick={cancelEdit}
										aria-label="Cancel"
									>
										<XIcon className="h-3.5 w-3.5" />
									</Button>
								</div>
							</div>
						) : (
							<Badge variant="secondary" className="pl-3 pr-1 py-1 h-8 gap-1 text-sm bg-secondary/80 hover:bg-secondary">
								<span>{msg}</span>
								<div className="flex ml-1 shrink-0">
									<Button 
										size="icon" 
										variant="ghost" 
										className="h-6 w-6 rounded-full hover:bg-black/10 dark:hover:bg-white/10" 
										onClick={() => startEdit(index, msg)}
										aria-label="Edit"
									>
										<Edit2Icon className="h-3 w-3" />
									</Button>
									<Button 
										size="icon" 
										variant="ghost" 
										className={cn(
											"h-6 w-6 rounded-full hover:bg-destructive/20 hover:text-destructive",
											messages.length <= 1 && "opacity-50 cursor-not-allowed"
										)}
										onClick={() => handleDelete(index)}
										disabled={messages.length <= 1}
										aria-label="Delete"
									>
										<Trash2Icon className="h-3 w-3" />
									</Button>
								</div>
							</Badge>
						)}
					</div>
				))}
			</div>

			<div className="flex flex-col gap-2 pt-2 border-t mt-2">
				{messages.length < 10 ? (
					<div className="flex items-center gap-2">
						<Input
							placeholder="Add a new message... (e.g. Happy Birthday! 🎂)"
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
						<Button onClick={handleAdd} size="sm">
							<PlusIcon className="mr-1 h-4 w-4" />
							Add
						</Button>
					</div>
				) : (
					<p className="text-sm font-medium text-amber-600 dark:text-amber-400">
						Maximum of 10 messages reached.
					</p>
				)}
				
				{error && (
					<p className="text-destructive text-sm font-medium">{error}</p>
				)}
			</div>
		</div>
	);
}
