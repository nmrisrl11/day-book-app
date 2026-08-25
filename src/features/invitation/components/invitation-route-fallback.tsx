import { Button } from "@/components/ui/button";
import { getHasInvitationsHint } from "@/helpers/storage";
import { LinkIcon } from "lucide-react";
import { InvitationEmptyState } from "./invitation-empty-state";
import { InvitationManagementSkeleton } from "./invitation-management-skeleton";

export function InvitationRouteFallback() {
	if (getHasInvitationsHint()) {
		return <InvitationManagementSkeleton />;
	}

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-foreground px-2 text-2xl font-bold tracking-tight">Invitation Links</h2>
				<Button disabled>
					<LinkIcon className="h-4 w-4 sm:mr-2" aria-hidden="true" />
					<span className="hidden sm:inline">Ask for Birthday</span>
				</Button>
			</div>

			<InvitationEmptyState />
		</div>
	);
}
