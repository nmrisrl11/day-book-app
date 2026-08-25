import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import type { Birthday } from "@/types/birthday";
import { CalendarIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { memo } from "react";

interface BirthdayListItemProps {
	birthday: Birthday;
	onEdit: (birthday: Birthday) => void;
	onDelete: (birthday: Birthday) => void;
	onExport: (birthday: Birthday) => void;
	selectable?: boolean;
	selected?: boolean;
	onSelectChange?: (id: string, selected: boolean) => void;
}

export const BirthdayListItem = memo(function BirthdayListItem({
	birthday,
	onEdit,
	onDelete,
	onExport,
	selectable = false,
	selected = false,
	onSelectChange,
}: BirthdayListItemProps) {
	// Parse the birthday string to display it nicely
	const [year, month, day] = birthday.birthday.split("-");
	const displayDate = new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString(
		undefined,
		{
			month: "long",
			day: "numeric",
			year: "numeric",
		},
	);

	return (
		<>
			<div
				className={cn(
					"border-border bg-card flex items-center justify-between gap-2 rounded-xl border p-3 shadow-sm transition-colors sm:p-4",
					selected && "border-primary/50 bg-primary/5",
				)}
			>
				<div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
					{selectable && (
						<Checkbox
							checked={selected}
							onCheckedChange={(checked) => onSelectChange?.(birthday.id, !!checked)}
							aria-label={`Select ${birthday.name}`}
							className="mr-1 shrink-0"
						/>
					)}
					<div className="ring-border h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-sm ring-1">
						<UserAvatar birthday={birthday} size={40} className="h-full w-full" />
					</div>
					<div className="flex min-w-0 flex-col">
						<span className="text-foreground truncate font-semibold">
							{birthday.name}
							{birthday.relationship && (
								<span className="text-muted-foreground ml-2 text-xs font-normal tracking-wider uppercase">
									• {birthday.relationship}
								</span>
							)}
						</span>
						<span className="text-muted-foreground truncate text-xs sm:text-sm">{displayDate}</span>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-0 sm:gap-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onExport(birthday)}
						title="Export to Calendar"
						aria-label="Export to Calendar"
					>
						<CalendarIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onEdit(birthday)}
						title="Edit"
						aria-label="Edit"
					>
						<Edit2Icon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-destructive/10 hover:text-destructive"
						onClick={() => onDelete(birthday)}
						title="Delete"
						aria-label="Delete"
					>
						<Trash2Icon className="h-4 w-4" aria-hidden="true" />
					</Button>
				</div>
			</div>
		</>
	);
});
