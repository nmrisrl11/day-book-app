import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BirthdayRepository } from "@/lib/birthday-repository";
import { RELATIONSHIP_OPTIONS, type Birthday } from "@/types/birthday";
import { gooeyToast } from "goey-toast";
import { Trash2Icon } from "lucide-react";

export interface BulkActionBarProps {
	selectedIds: Set<string>;
	setSelectedIds: (ids: Set<string>) => void;
	handleBulkDelete: () => void;
}

export function BulkActionBar({
	selectedIds,
	setSelectedIds,
	handleBulkDelete,
}: BulkActionBarProps) {
	if (selectedIds.size === 0) return null;

	return (
		<div className="bg-popover text-popover-foreground animate-in fade-in slide-in-from-bottom-4 no-scrollbar fixed bottom-6 left-1/2 z-50 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-full border px-4 py-2 shadow-lg sm:gap-3">
			<div className="text-sm font-medium whitespace-nowrap">
				{selectedIds.size} {selectedIds.size === 1 ? "selected" : "selected"}
			</div>

			<div className="bg-border h-4 w-px shrink-0" />

			<Select
				onValueChange={async (val) => {
					const count = selectedIds.size;
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
				}}
			>
				<SelectTrigger className="h-8 w-35 border-none bg-transparent px-2 shadow-none focus:ring-0 sm:w-40">
					<SelectValue placeholder="Set Relationship" />
				</SelectTrigger>
				<SelectContent position="popper" side="top">
					{RELATIONSHIP_OPTIONS.map((option) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<div className="bg-border h-4 w-px shrink-0" />

			<Button
				variant="ghost"
				size="sm"
				className="hover:bg-destructive/10 hover:text-destructive h-8 shrink-0 rounded-full px-3"
				onClick={handleBulkDelete}
				aria-label="Delete Selected"
			>
				<Trash2Icon className="h-4 w-4 sm:mr-2" aria-hidden="true" />
				<span className="hidden sm:inline">Delete Selected</span>
			</Button>

			<div className="bg-border h-4 w-px shrink-0" />

			<Button
				variant="ghost"
				size="sm"
				className="hover:bg-muted h-8 shrink-0 rounded-full px-3"
				onClick={() => setSelectedIds(new Set())}
			>
				Clear
			</Button>
		</div>
	);
}
