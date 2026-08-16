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
				<DialogFooter className="w-full flex-col gap-2 sm:flex-row sm:justify-between">
					<Button
						variant="destructive"
						onClick={onConfirm}
						aria-label="Delete"
						className="w-full sm:flex-1"
					>
						Delete
					</Button>
					{isDeleteAll && onExport && (
						<Button
							variant="secondary"
							onClick={onExport}
							aria-label="Export Data"
							className="w-full sm:flex-1"
						>
							<DownloadIcon className="mr-2 h-4 w-4" />
							Export Data
						</Button>
					)}
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="mt-2 w-full sm:mt-0 sm:flex-1"
					>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
