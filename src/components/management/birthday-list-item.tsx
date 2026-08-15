import type { Birthday } from "@/types/birthday";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";

interface BirthdayListItemProps {
	birthday: Birthday;
	onEdit: () => void;
	onDelete: () => void;
}

export function BirthdayListItem({ birthday, onEdit, onDelete }: BirthdayListItemProps) {
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
		<div className="border-border bg-card flex items-center justify-between rounded-xl border p-4 shadow-sm">
			<div className="flex items-center gap-4">
				<div className="ring-border h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-sm ring-1">
					<UserAvatar birthday={birthday} size={40} className="h-full w-full" />
				</div>
				<div className="flex flex-col">
					<span className="text-foreground font-semibold">{birthday.name}</span>
					<span className="text-muted-foreground text-sm">{displayDate}</span>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
					<Edit2Icon className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="text-destructive hover:bg-destructive/10 hover:text-destructive"
					onClick={onDelete}
					title="Delete"
				>
					<Trash2Icon className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
