import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ResetSettingsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export function ResetSettingsModal({ open, onOpenChange, onConfirm }: ResetSettingsModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onOpenAutoFocus={(e) => {
					e.preventDefault();
					document.getElementById("cancel-reset-btn")?.focus();
				}}
			>
				<DialogHeader>
					<DialogTitle>Reset All Settings</DialogTitle>
					<DialogDescription asChild>
						<p>
							Are you sure you want to reset{" "}
							<span className="text-foreground font-semibold">ALL</span> settings to their defaults?
							This includes your theme, sound preferences, custom greetings, and display options.
							This action cannot be undone.
						</p>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button id="cancel-reset-btn" variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm} aria-label="Reset">
						Reset Settings
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
