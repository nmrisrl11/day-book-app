import { Button } from "@/components/ui/button";
import { CakeIcon } from "lucide-react";

interface ManageEmptyStateProps {
	onAdd?: () => void;
}

export function ManageEmptyState({ onAdd }: ManageEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-4 py-16 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
				<CakeIcon className="h-8 w-8 text-primary" aria-hidden="true" />
			</div>
			<div className="flex max-w-sm flex-col gap-1">
				<h3 className="text-lg font-semibold tracking-tight">No birthdays yet</h3>
				<p className="text-sm text-muted-foreground">
					Keep track of your family and friends' birthdays so you never forget one again.
				</p>
			</div>
			<Button onClick={onAdd} disabled={!onAdd} className="mt-2">
				Add a Person
			</Button>
		</div>
	);
}
