import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserAvatar } from "@/components/user-avatar";
import { formatAgeDisplay } from "@/helpers";
import { cn } from "@/lib/utils";
import type { Birthday } from "@/types/birthday";
import { CalendarIcon, Edit2Icon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface BirthdayListItemProps {
	birthday: Birthday;
	onEdit: (birthday: Birthday) => void;
	onDelete: (birthday: Birthday) => void;
	onExport: (birthday: Birthday) => void;
	selectable?: boolean;
	selected?: boolean;
	onSelectChange?: (id: string, selected: boolean) => void;
	currentDate: Date;
}

export const BirthdayListItem = memo(function BirthdayListItem({
	birthday,
	onEdit,
	onDelete,
	onExport,
	selectable = false,
	selected = false,
	onSelectChange,
	currentDate,
}: BirthdayListItemProps) {
	const [isActionsOpen, setIsActionsOpen] = useState(false);

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

	const ageDisplay = useMemo(
		() => formatAgeDisplay(birthday.birthday, currentDate),
		[birthday.birthday, currentDate],
	);

	return (
		<>
			<div
				className={cn(
					"flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 shadow-sm transition-colors sm:p-4",
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
					<Link
						to={`/person/${birthday.id}`}
						className="flex min-w-0 flex-1 items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:gap-4"
						aria-label={`View ${birthday.name}'s profile`}
					>
						<div className="h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-sm ring-1 ring-border">
							<UserAvatar birthday={birthday} size={40} className="h-full w-full" />
						</div>
						<div className="flex min-w-0 flex-col">
							<span className="truncate font-semibold text-foreground">
								{birthday.name}
								{birthday.relationship && (
									<span className="ml-2 text-xs font-normal tracking-wider text-muted-foreground uppercase">
										• {birthday.relationship}
									</span>
								)}
							</span>
							<span className="truncate text-xs text-muted-foreground sm:text-sm">
								{displayDate}
								{ageDisplay !== null && (
									<>
										<span className="mx-2 opacity-50">•</span>
										{ageDisplay}
									</>
								)}
							</span>
						</div>
					</Link>
				</div>

				{/* Desktop Actions */}
				<div className="hidden shrink-0 items-center gap-1 sm:flex">
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

				{/* Mobile Actions */}
				<div className="flex shrink-0 items-center sm:hidden">
					<Popover open={isActionsOpen} onOpenChange={setIsActionsOpen}>
						<PopoverTrigger asChild>
							<Button variant="ghost" size="icon" aria-label="More actions">
								<MoreVerticalIcon className="h-4 w-4" aria-hidden="true" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-40 p-1" align="end">
							<div className="flex flex-col">
								<Button
									variant="ghost"
									size="sm"
									className="h-9 justify-start px-2 font-normal"
									onClick={() => {
										setIsActionsOpen(false);
										onExport(birthday);
									}}
								>
									<CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
									Export
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="h-9 justify-start px-2 font-normal"
									onClick={() => {
										setIsActionsOpen(false);
										onEdit(birthday);
									}}
								>
									<Edit2Icon className="mr-2 h-4 w-4" aria-hidden="true" />
									Edit
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="h-9 justify-start px-2 font-normal text-destructive hover:bg-destructive/10 hover:text-destructive"
									onClick={() => {
										setIsActionsOpen(false);
										onDelete(birthday);
									}}
								>
									<Trash2Icon className="mr-2 h-4 w-4" aria-hidden="true" />
									Delete
								</Button>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</>
	);
});
