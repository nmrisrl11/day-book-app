import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	birthdayName?: string;
}

export function DeleteConfirmationModal({
	open,
	onOpenChange,
	onConfirm,
	birthdayName,
	isDeleteAll = false,
}: DeleteConfirmationModalProps & { isDeleteAll?: boolean }) {
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
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
