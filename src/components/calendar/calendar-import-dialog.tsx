import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { PartyHat } from "@/components/ui/party-hat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FULL_MONTHS } from "@/constants/months";
import { formatBirthdayDisplay } from "@/helpers/birthday-utils";
import { cn } from "@/lib/utils";
import { useDayBookStore } from "@/store/day-book-store";
import type { Birthday } from "@/types/birthday";
import { useEffect, useState } from "react";

interface CalendarImportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	foundBirthdays: Birthday[];
	onImportSuccess: () => void;
}

export function CalendarImportDialog({
	open,
	onOpenChange,
	foundBirthdays,
	onImportSuccess,
}: CalendarImportDialogProps) {
	const { birthdays: existingBirthdays, importData } = useDayBookStore();
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const isDuplicate = (b: Birthday) => {
		return existingBirthdays.some(
			(ex) => ex.name.toLowerCase() === b.name.toLowerCase() && ex.birthday === b.birthday,
		);
	};

	// Auto-select birthdays that don't already exist
	useEffect(() => {
		if (open) {
			const initialSelected = new Set<string>();
			for (const b of foundBirthdays) {
				if (!isDuplicate(b)) {
					initialSelected.add(b.id);
				}
			}
			setSelectedIds(initialSelected);
		}
	}, [open, foundBirthdays, existingBirthdays]);

	const selectableBirthdays = foundBirthdays.filter((b) => !isDuplicate(b));
	const allSelected =
		selectableBirthdays.length > 0 && selectableBirthdays.every((b) => selectedIds.has(b.id));

	const toggleAll = () => {
		const newSelected = new Set(selectedIds);
		if (allSelected) {
			foundBirthdays.forEach((b) => newSelected.delete(b.id));
		} else {
			selectableBirthdays.forEach((b) => newSelected.add(b.id));
		}
		setSelectedIds(newSelected);
	};

	const toggleSelection = (id: string) => {
		const newSelected = new Set(selectedIds);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelectedIds(newSelected);
	};

	const handleImport = () => {
		const toImport = foundBirthdays.filter((b) => selectedIds.has(b.id));
		if (toImport.length > 0) {
			importData([...existingBirthdays, ...toImport]);
			onImportSuccess();
		}
		onOpenChange(false);
	};

	const newCount = selectedIds.size;

	const today = new Date();
	const currentMonth = today.getMonth() + 1;
	const currentDay = today.getDate();

	const isCelebrating = (birthdayStr: string) => {
		const [, month, day] = birthdayStr.split("-").map(Number);
		return month === currentMonth && day === currentDay;
	};

	// Group birthdays by month
	const groupedBirthdays = foundBirthdays.reduce(
		(acc, curr) => {
			const [, monthStr] = curr.birthday.split("-");
			const monthIndex = parseInt(monthStr, 10) - 1;
			const month = FULL_MONTHS[monthIndex] || "Unknown";

			if (!acc[month]) acc[month] = [];
			acc[month].push(curr);
			return acc;
		},
		{} as Record<string, Birthday[]>,
	);

	// Sort groupedBirthdays by month index
	const sortedMonthGroups = Object.entries(groupedBirthdays).sort((a, b) => {
		return FULL_MONTHS.indexOf(a[0] as any) - FULL_MONTHS.indexOf(b[0] as any);
	});

	// Sort birthdays within the month by date
	sortedMonthGroups.forEach(([_, celebrants]) => {
		celebrants.sort((a, b) => {
			const [, , dayA] = a.birthday.split("-").map(Number);
			const [, , dayB] = b.birthday.split("-").map(Number);
			return dayA - dayB;
		});
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-border/50 bg-background/95 rounded-2xl shadow-2xl backdrop-blur-md sm:max-w-md">
				<DialogHeader className="p-0 pb-4">
					<DialogTitle className="text-foreground font-sans text-2xl font-bold tracking-wide">
						Import Birthdays
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						We found {foundBirthdays.length} birthday{foundBirthdays.length === 1 ? "" : "s"} in the
						calendar. Select the ones you'd like to import into DayBook.
					</DialogDescription>
					{foundBirthdays.length > 0 && (
						<div className="flex items-center justify-between pt-2">
							<span className="text-muted-foreground text-sm font-medium">{newCount} selected</span>
							<Button
								variant="ghost"
								size="sm"
								className="text-primary h-auto p-0 hover:bg-transparent"
								onClick={toggleAll}
							>
								{allSelected ? "Deselect All" : "Select All"}
							</Button>
						</div>
					)}
				</DialogHeader>

				<ScrollArea className="max-h-[50vh] pr-4">
					{foundBirthdays.length === 0 ? (
						<div className="text-muted-foreground py-12 text-center italic">
							No birthdays found in the selected file.
						</div>
					) : (
						<div className="flex flex-col gap-6 pb-4">
							{sortedMonthGroups.map(([month, celebrants]) => {
								const selectableInMonth = celebrants.filter((b) => !isDuplicate(b));
								const allSelectedInMonth =
									selectableInMonth.length > 0 &&
									selectableInMonth.every((b) => selectedIds.has(b.id));

								const toggleMonth = () => {
									const newSelected = new Set(selectedIds);
									if (allSelectedInMonth) {
										celebrants.forEach((b) => newSelected.delete(b.id));
									} else {
										// If all are duplicates, allow selecting them all if they click "Select All"
										const toSelect = selectableInMonth.length > 0 ? selectableInMonth : celebrants;
										toSelect.forEach((b) => newSelected.add(b.id));
									}
									setSelectedIds(newSelected);
								};

								return (
									<div key={month} className="flex flex-col gap-3">
										<div className="bg-background/95 sticky top-0 z-10 flex items-center justify-between py-1">
											<h4 className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
												{month}
											</h4>
											<Button
												variant="ghost"
												size="sm"
												className="text-primary h-auto p-0 text-xs hover:bg-transparent"
												onClick={toggleMonth}
											>
												{allSelectedInMonth ? "Deselect All" : "Select All"}
											</Button>
										</div>
										<div className="flex flex-col gap-2">
											{celebrants.map((b) => {
												const duplicate = isDuplicate(b);
												const isSelected = selectedIds.has(b.id);
												const isBday = isCelebrating(b.birthday);

												return (
													<label
														key={b.id}
														className={cn(
															"flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
															isSelected
																? "border-primary bg-primary/5"
																: "border-border hover:bg-accent/50",
															isBday && "relative overflow-hidden",
														)}
													>
														{isBday && (
															<div className="absolute top-1 -right-3 -z-10 -rotate-45">
																<PartyHat className="h-20 w-20" />
															</div>
														)}

														<input
															type="checkbox"
															className="text-primary focus:ring-primary accent-primary h-4 w-4 rounded border-gray-300"
															checked={isSelected}
															onChange={() => toggleSelection(b.id)}
														/>
														<div className="flex flex-1 flex-col">
															<div className="flex items-center gap-2">
																<span className="text-foreground text-sm font-semibold">
																	{b.name}
																</span>
															</div>
															<span className="text-muted-foreground text-xs font-medium">
																{formatBirthdayDisplay(b.birthday)}
															</span>
														</div>
														{duplicate && (
															<span className="text-muted-foreground bg-muted rounded-md px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
																Exists
															</span>
														)}
													</label>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</ScrollArea>

				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleImport} disabled={newCount === 0}>
						Import {newCount} {newCount === 1 ? "Birthday" : "Birthdays"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
