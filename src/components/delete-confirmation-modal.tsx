import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { type ReactNode } from "react";

interface DeleteConfirmationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: ReactNode;
	description?: ReactNode;
	footer?: ReactNode;
}

export function DeleteConfirmationModal({
	open,
	onOpenChange,
	title,
	description,
	footer,
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
					<DialogTitle>{title || "Confirm Deletion"}</DialogTitle>
					<DialogDescription asChild>
						{description ? (
							typeof description === "string" ? (
								<p>{description}</p>
							) : (
								description
							)
						) : (
							<p>Are you sure you want to delete this item? This action cannot be undone.</p>
						)}
					</DialogDescription>
				</DialogHeader>
				{footer && <DialogFooter>{footer}</DialogFooter>}
			</DialogContent>
		</Dialog>
	);
}

export default DeleteConfirmationModal;
