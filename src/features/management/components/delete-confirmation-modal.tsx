import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DownloadIcon } from "lucide-react";

interface DeleteConfirmationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	birthdayName?: string;
	isDeleteAll?: boolean;
	onExport?: () => void;
}

export function DeleteConfirmationModal({
	open,
	onOpenChange,
	onConfirm,
	birthdayName,
	isDeleteAll = false,
	onExport,
}: DeleteConfirmationModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onOpenAutoFocus={(e) => {
					e.preventDefault();
					document.getElementById("cancel-delete-btn")?.focus();
				}}
			>
				<DialogHeader>
					<DialogTitle>{isDeleteAll ? "Delete All Birthdays" : "Delete Birthday"}</DialogTitle>
					<DialogDescription asChild>
						{isDeleteAll ? (
							<div className="flex flex-col gap-4">
								<p>
									Are you sure you want to delete{" "}
									<span className="text-foreground font-semibold">ALL</span> birthdays? This action
									cannot be undone.
								</p>
								{onExport && (
									<div className="bg-muted/50 rounded-lg border p-3">
										<p className="mb-3 text-sm">
											Before deleting, you can export your data to a file as a backup.
										</p>
										<Button
											variant="secondary"
											onClick={onExport}
											aria-label="Export Data"
											className="w-full"
										>
											<DownloadIcon className="mr-2 h-4 w-4" />
											Export Data
										</Button>
									</div>
								)}
							</div>
						) : (
							<p>
								Are you sure you want to delete the birthday for{" "}
								<span className="text-foreground font-semibold">{birthdayName}</span>? This action
								cannot be undone.
							</p>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button id="cancel-delete-btn" variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>

					<Button variant="destructive" onClick={onConfirm} aria-label="Delete">
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
