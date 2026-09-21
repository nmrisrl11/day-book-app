import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getAvailableRelationshipOptions } from "@/helpers/birthday-utils";
import { BirthdayRepository } from "@/lib/birthday-repository";
import { RELATIONSHIP_OPTIONS, type Birthday } from "@/types/birthday";
import { gooeyToast } from "goey-toast";
import { Trash2Icon } from "lucide-react";

export interface BulkActionBarProps {
	selectedIds: Set<string>;
	setSelectedIds: (ids: Set<string>) => void;
	handleBulkDelete: () => void;
	hasMeRelationship?: boolean;
}

export function BulkActionBar({
	selectedIds,
	setSelectedIds,
	handleBulkDelete,
	hasMeRelationship,
}: BulkActionBarProps) {
	if (selectedIds.size === 0) return null;

	return (
		<div className="fixed bottom-6 left-1/2 z-50 no-scrollbar flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 animate-in items-center gap-2 overflow-x-auto rounded-full border bg-popover px-4 py-2 text-popover-foreground shadow-lg fade-in slide-in-from-bottom-4 sm:gap-3">
			<div className="text-sm font-medium whitespace-nowrap">
				{selectedIds.size} {selectedIds.size === 1 ? "selected" : "selected"}
			</div>

			<div className="h-4 w-px shrink-0 bg-border" />

			<Select
				onValueChange={async (val) => {
					const count = selectedIds.size;
					try {
						await Promise.all(
							Array.from(selectedIds).map((id) =>
								BirthdayRepository.update(id, { relationship: val as Birthday["relationship"] }),
							),
						);
						setSelectedIds(new Set());
						gooeyToast.success("People updated", {
							description: `${count} ${count === 1 ? "person is" : "people are"} now marked as ${val}.`,
							showTimestamp: false,
							classNames: {
								content: "items-center text-center",
								title: "text-center w-full",
								description: "text-center justify-center flex w-full",
							},
						});
					} catch (error) {
						gooeyToast.error("Update failed", {
							id: "bulk-update-error",
							description: error instanceof Error ? error.message : "Failed to update people.",
							showTimestamp: false,
							classNames: {
								content: "items-center text-center",
								title: "text-center w-full",
								description: "text-center justify-center flex w-full",
							},
						});
					}
				}}
			>
				<SelectTrigger className="h-8 w-35 border-none bg-transparent px-2 shadow-none focus:ring-0 sm:w-40">
					<SelectValue placeholder="Set Relationship" />
				</SelectTrigger>
				<SelectContent position="popper" side="top">
					<SelectGroup>
						{getAvailableRelationshipOptions({
							hasMeProfile: !!hasMeRelationship,
							isBulkMode: selectedIds.size > 1,
							options: RELATIONSHIP_OPTIONS,
						}).map((option) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>

			<div className="h-4 w-px shrink-0 bg-border" />

			<Button
				variant="ghost"
				size="sm"
				className="h-8 shrink-0 rounded-full px-3 hover:bg-destructive/10 hover:text-destructive"
				onClick={handleBulkDelete}
				aria-label="Delete Selected"
			>
				<Trash2Icon className="h-4 w-4 sm:mr-2" aria-hidden="true" />
				<span className="hidden sm:inline">Delete Selected</span>
			</Button>

			<div className="h-4 w-px shrink-0 bg-border" />

			<Button
				variant="ghost"
				size="sm"
				className="h-8 shrink-0 rounded-full px-3 hover:bg-muted"
				onClick={() => setSelectedIds(new Set())}
			>
				Clear
			</Button>
		</div>
	);
}
