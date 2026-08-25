import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { type ReactNode, useRef } from "react";

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
	const contentRef = useRef<HTMLDivElement>(null);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				ref={contentRef}
				onOpenAutoFocus={(e) => {
					const cancelBtn = contentRef.current?.querySelector("#cancel-delete-btn") as HTMLElement;
					if (cancelBtn) {
						e.preventDefault();
						cancelBtn.focus();
					}
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
