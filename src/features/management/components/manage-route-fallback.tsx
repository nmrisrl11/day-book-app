import { Button } from "@/components/ui/button";
import { getHasDataHint } from "@/helpers/storage";
import { LinkIcon, PlusIcon } from "lucide-react";
import { ManageBirthdaysSkeleton } from "./manage-birthdays-skeleton";
import { ManageEmptyState } from "./manage-empty-state";

export function ManageRouteFallback() {
	if (getHasDataHint()) {
		return <ManageBirthdaysSkeleton />;
	}

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-foreground px-2 text-2xl font-bold tracking-tight">Manage Birthdays</h2>
				<div className="flex items-center gap-2">
					<Button variant="outline" disabled>
						<LinkIcon className="mr-2 h-4 w-4" aria-hidden="true" />
						<span className="hidden sm:inline">Ask for Birthday</span>
					</Button>
					<Button disabled>
						<PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
						<span className="hidden sm:inline">Add Birthday</span>
						<span className="sm:hidden">Add</span>
					</Button>
				</div>
			</div>

			<ManageEmptyState />
		</div>
	);
}
