import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";

interface InvitationEmptyStateProps {
	onAdd?: () => void;
}

export function InvitationEmptyState({ onAdd }: InvitationEmptyStateProps) {
	return (
		<div className="border-border bg-card/50 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-4 py-16 text-center">
			<div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
				<LinkIcon className="text-primary h-8 w-8" aria-hidden="true" />
			</div>
			<div className="flex max-w-sm flex-col gap-1">
				<h3 className="text-lg font-semibold tracking-tight">No Invitation Links</h3>
				<p className="text-muted-foreground text-sm">
					Generate private invitation links to send to your friends. They will appear here so you
					can easily manage them later.
				</p>
			</div>
			<Button onClick={onAdd} disabled={!onAdd} className="mt-2">
				Ask for Birthday
			</Button>
		</div>
	);
}
