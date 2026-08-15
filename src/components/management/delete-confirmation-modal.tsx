import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isDeleteAll ? "Delete All Birthdays" : "Delete Birthday"}</DialogTitle>
					<DialogDescription>
						{isDeleteAll ? (
							<>
								Are you sure you want to delete{" "}
								<span className="text-foreground font-semibold">ALL</span> birthdays? This action
								cannot be undone.
							</>
						) : (
							<>
								Are you sure you want to delete the birthday for{" "}
								<span className="text-foreground font-semibold">{birthdayName}</span>? This action
								cannot be undone.
							</>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex-col gap-2 sm:flex-row">
					<div className="flex flex-1 gap-2">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="flex-1 sm:flex-none"
						>
							Cancel
						</Button>
					</div>
					<div className="flex gap-2">
						{isDeleteAll && onExport && (
							<Button variant="secondary" onClick={onExport} aria-label="Export Data">
								<DownloadIcon className="mr-2 h-4 w-4" />
								Export Data
							</Button>
						)}
						<Button variant="destructive" onClick={onConfirm} aria-label="Delete">
							Delete
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
