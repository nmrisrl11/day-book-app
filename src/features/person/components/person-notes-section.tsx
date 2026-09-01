import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Birthday } from "@/types/birthday";
import { PlusIcon, StickyNoteIcon } from "lucide-react";

interface PersonNotesSectionProps {
	person: Birthday;
	onAddNote: () => void;
}

export function PersonNotesSection({ person, onAddNote }: PersonNotesSectionProps) {
	const hasNotes = person.notes && person.notes.length > 0;

	return (
		<div className="bg-blue-500/5 border-blue-500/20 relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 shadow-sm">
			<div className="absolute top-0 right-0 p-4 opacity-5">
				<StickyNoteIcon className="h-24 w-24" />
			</div>

			<div className="relative z-10 flex items-center justify-between mb-4">
				<h3 className="text-blue-800 dark:text-blue-400 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider">
					<StickyNoteIcon className="h-4 w-4 fill-blue-500/50" />
					Notes & Details
				</h3>
				{hasNotes && (
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 rounded-full p-0 text-blue-600 hover:bg-blue-500/20 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
						onClick={onAddNote}
						aria-label="Add Note"
					>
						<PlusIcon className="h-4 w-4" />
					</Button>
				)}
			</div>

			<div className="relative z-10 flex flex-1 flex-col justify-center">
				{hasNotes ? (
					<div className="flex flex-wrap gap-2">
						{person.notes.map((note, index) => (
							<Badge
								key={index}
								variant="outline"
								className="border-blue-500/30 shadow-black/5 bg-background/50 h-auto max-w-full whitespace-normal wrap-break-word py-1.5 px-3 text-left shadow-sm backdrop-blur-sm text-sm"
							>
								<span
									className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/80"
									aria-hidden="true"
								/>
								<span className="min-w-0 wrap-break-word font-normal">{note}</span>
							</Badge>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center text-center py-6">
						<h4 className="text-foreground font-semibold mb-1">Remember the little things</h4>
						<p className="text-muted-foreground text-sm mb-4 max-w-xs">
							Keep meaningful details, memories, or things you'd like to remember about{" "}
							{person.name}.
						</p>
						<Button size="sm" variant="blue" onClick={onAddNote}>
							Add a note
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
