import { Button } from "@/components/ui/button";

interface ManageEmptyStateProps {
	onAdd?: () => void;
}

export function ManageEmptyState({ onAdd }: ManageEmptyStateProps) {
	return (
		<div className="border-border bg-card/50 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-4 py-16 text-center">
			<div className="text-4xl">🎂</div>
			<div className="max-w-md">
				<h3 className="mb-2 text-lg font-semibold">No birthdays yet</h3>
				<p className="text-muted-foreground mb-6">
					Keep track of your family and friends' birthdays so you never forget one again.
				</p>
				<Button onClick={onAdd} disabled={!onAdd}>
					Add Your First Birthday
				</Button>
			</div>
		</div>
	);
}
