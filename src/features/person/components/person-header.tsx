import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import {
	calculateDaysUntilBirthday,
	formatAgeDisplay,
	formatBirthdayDisplay,
} from "@/helpers/birthday-utils";
import type { Birthday } from "@/types/birthday";
import { CalendarIcon, CalendarPlusIcon, Edit2Icon, GiftIcon, UsersIcon } from "lucide-react";

interface PersonHeaderProps {
	person: Birthday;
	currentDate: Date;
	onEdit: () => void;
	onExport: () => void;
}

export function PersonHeader({ person, currentDate, onEdit, onExport }: PersonHeaderProps) {
	const ageDisplay = formatAgeDisplay(person.birthday, currentDate);
	const formattedDate = formatBirthdayDisplay(person.birthday);
	const daysUntil = calculateDaysUntilBirthday(person.birthday, currentDate);

	return (
		<div className="relative mt-12 flex flex-col items-center overflow-visible rounded-3xl border border-border bg-card px-6 pt-0 pb-6 text-center shadow-sm sm:mt-16 sm:px-8 sm:pb-8">
			{/* Avatar */}
			<div className="relative -mt-12 mb-4 sm:-mt-16">
				<div className="relative z-10 rounded-full bg-card p-1.5 ring-1 ring-border/50">
					<UserAvatar birthday={person} size={128} className="h-24 w-24 sm:h-28 sm:w-28" />
				</div>
			</div>

			{/* Name */}
			<div className="mb-6 flex flex-col items-center gap-2">
				<h1 className="font-sans text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
					{person.name}
				</h1>
			</div>

			{/* Date, Age, and Relationship Information */}
			<div className="w-full max-w-lg rounded-2xl border border-border/40 bg-secondary/30 p-4 shadow-sm">
				<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
					<div className="flex flex-col items-center gap-1.5">
						<span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
							<CalendarIcon className="h-3 w-3" /> Date
						</span>
						<span className="text-sm font-semibold text-foreground">{formattedDate}</span>
					</div>

					{ageDisplay !== null && (
						<div className="flex flex-col items-center gap-1.5">
							<span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
								<GiftIcon className="h-3 w-3" /> Age
							</span>
							<span className="text-sm font-semibold text-foreground">{ageDisplay}</span>
						</div>
					)}

					{person.relationship && (
						<div className="flex flex-col items-center gap-1.5">
							<span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
								<UsersIcon className="h-3 w-3" /> Relationship
							</span>
							<span className="text-sm font-semibold text-foreground capitalize">
								{person.relationship}
							</span>
						</div>
					)}
				</div>

				<div className="mt-4 border-t border-border/40 pt-4 text-sm font-medium">
					{daysUntil === 0 ? (
						<span className="font-bold text-primary">It's {person.name}'s birthday today! 🎉</span>
					) : daysUntil === 1 ? (
						<span>
							{person.name}'s birthday is{" "}
							<strong className="font-bold text-foreground">tomorrow!</strong>
						</span>
					) : (
						<span>
							Birthday in <strong className="font-bold text-foreground">{daysUntil} days</strong>
						</span>
					)}
				</div>
			</div>

			{/* Actions */}
			<div className="mt-6 flex flex-wrap justify-center gap-3">
				<Button variant="outline" onClick={onEdit}>
					<Edit2Icon className="h-4 w-4" />
					Edit Person
				</Button>
				<Button variant="outline" onClick={onExport}>
					<CalendarPlusIcon className="h-4 w-4" />
					Add to Calendar
				</Button>
			</div>
		</div>
	);
}
