import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { APP_INFO } from "@/constants/app-info";
import { FULL_MONTHS } from "@/constants/months";
import { BirthdayRepository } from "@/lib/birthday-repository";
import { db } from "@/lib/db";
import type { Birthday } from "@/types/birthday";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useLiveQuery } from "dexie-react-hooks";
import { gooeyToast } from "goey-toast";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ImportPreviewDialogProps {
	source: "json" | "ics";
	open: boolean;
	onOpenChange: (open: boolean) => void;
	foundBirthdays: Birthday[];
	onImportSuccess?: () => void;
}

import { VirtualBirthdayRow, VirtualHeaderRow } from "./import-preview-rows";

export type VirtualItem =
	| { type: "header"; month: string; celebrants: Birthday[] }
	| { type: "birthday"; birthday: Birthday };

const EMPTY_ARRAY: Birthday[] = [];

export function ImportPreviewDialog({
	source,
	open,
	onOpenChange,
	foundBirthdays,
	onImportSuccess,
}: ImportPreviewDialogProps) {
	const existingBirthdays = useLiveQuery(() => db.birthdays.toArray(), []) ?? EMPTY_ARRAY;
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const navigate = useNavigate();

	const duplicatesInfo = useMemo(() => {
		const seen = new Set<string>();
		for (const ex of existingBirthdays) {
			seen.add(`${ex.name.toLowerCase()}|${ex.birthday}`);
		}

		const duplicateMap = new Map<string, boolean>();
		for (const b of foundBirthdays) {
			const key = `${b.name.toLowerCase()}|${b.birthday}`;
			if (seen.has(key)) {
				duplicateMap.set(b.id, true);
			} else {
				seen.add(key);
				duplicateMap.set(b.id, false);
			}
		}
		return duplicateMap;
	}, [existingBirthdays, foundBirthdays]);

	const isDuplicate = useCallback(
		(b: Birthday) => {
			return duplicatesInfo.get(b.id) || false;
		},
		[duplicatesInfo],
	);

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
	}, [open, foundBirthdays, isDuplicate]);

	const selectableBirthdays = useMemo(
		() => foundBirthdays.filter((b) => !isDuplicate(b)),
		[foundBirthdays, isDuplicate],
	);
	const allSelected =
		selectableBirthdays.length > 0 && selectableBirthdays.every((b) => selectedIds.has(b.id));

	const toggleAll = useCallback(() => {
		setSelectedIds((prev) => {
			const newSelected = new Set(prev);
			const isAllSelected =
				selectableBirthdays.length > 0 && selectableBirthdays.every((b) => prev.has(b.id));
			if (isAllSelected) {
				foundBirthdays.forEach((b) => newSelected.delete(b.id));
			} else {
				selectableBirthdays.forEach((b) => newSelected.add(b.id));
			}
			return newSelected;
		});
	}, [selectableBirthdays, foundBirthdays]);

	const toggleSelection = useCallback((id: string) => {
		setSelectedIds((prev) => {
			const newSelected = new Set(prev);
			if (newSelected.has(id)) {
				newSelected.delete(id);
			} else {
				newSelected.add(id);
			}
			return newSelected;
		});
	}, []);

	const toggleMonth = useCallback((celebrantIds: string[], selectAll: boolean) => {
		setSelectedIds((prev) => {
			const newSelected = new Set(prev);
			if (selectAll) {
				celebrantIds.forEach((id) => newSelected.delete(id));
			} else {
				celebrantIds.forEach((id) => {
					// Only select if not duplicate. (Though celebrantIds usually includes duplicates, so we should filter)
					// Wait, we need to know if it's a duplicate. We can just add all, but wait, duplicates shouldn't be selected.
					// Let's pass the non-duplicate ids from the header render instead!
					newSelected.add(id);
				});
			}
			return newSelected;
		});
	}, []);

	const handleImport = async () => {
		const toImport = foundBirthdays.filter((b) => selectedIds.has(b.id) && !isDuplicate(b));

		if (toImport.length > 0) {
			await BirthdayRepository.bulkSave(toImport);

			// Wait, the number of records actually existing in the file that were ALREADY in the app is:
			const alreadyExistedCount = foundBirthdays.filter((b) => isDuplicate(b)).length;

			if (alreadyExistedCount > 0) {
				gooeyToast.success(`Import complete!`, {
					description: (
						<div>
							<span className="font-semibold">{toImport.length}</span> birthday
							{toImport.length === 1 ? "" : "s"} {toImport.length === 1 ? "has" : "have"} been added
							successfully. <br />
							<span className="font-semibold">{alreadyExistedCount}</span>{" "}
							{alreadyExistedCount === 1 ? "birthday was" : "birthdays were"} already there.
						</div>
					),
					showTimestamp: false,
					classNames: {
						content: "items-center text-center",
						title: "text-center w-full",
					},
				});
			} else {
				gooeyToast.success(`Import Complete!`, {
					id: "import-complete",
					description: (
						<div>
							<span className="font-semibold">{toImport.length}</span> birthday
							{toImport.length === 1 ? "" : "s"} {toImport.length === 1 ? "has" : "have"} been
							successfully added. <br /> Everything is all set!
						</div>
					),
					showTimestamp: false,
					classNames: {
						content: "items-center text-center",
						title: "text-center w-full",
					},
				});
			}

			onImportSuccess?.();
			navigate("/manage");
		}
		onOpenChange(false);
	};

	const newCount = selectedIds.size;

	const today = new Date();
	const currentMonth = today.getMonth() + 1;
	const currentDay = today.getDate();

	const isCelebrating = useCallback(
		(birthdayStr: string) => {
			const [, month, day] = birthdayStr.split("-").map(Number);
			return month === currentMonth && day === currentDay;
		},
		[currentMonth, currentDay],
	);

	// Group birthdays by month
	const groupedBirthdays = useMemo(() => {
		return foundBirthdays.reduce(
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
	}, [foundBirthdays]);

	const flattenedItems = useMemo(() => {
		const sortedMonthGroups = Object.entries(groupedBirthdays).sort((a, b) => {
			return (
				FULL_MONTHS.indexOf(a[0] as (typeof FULL_MONTHS)[number]) -
				FULL_MONTHS.indexOf(b[0] as (typeof FULL_MONTHS)[number])
			);
		});

		const items: VirtualItem[] = [];
		sortedMonthGroups.forEach(([month, celebrants]) => {
			celebrants.sort((a, b) => {
				const [, , dayA] = a.birthday.split("-").map(Number);
				const [, , dayB] = b.birthday.split("-").map(Number);
				return dayA - dayB;
			});

			items.push({ type: "header", month, celebrants });
			celebrants.forEach((b) => {
				items.push({ type: "birthday", birthday: b });
			});
		});

		return items;
	}, [groupedBirthdays]);

	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: flattenedItems.length,
		getScrollElement: () => parentRef.current,
		estimateSize: (index) => {
			const item = flattenedItems[index];
			return item.type === "header" ? 40 : 84;
		},
		overscan: 10,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();

	// Calculate active sticky header index dynamically
	const activeStickyIndex = useMemo(() => {
		if (virtualItems.length === 0) return null;
		const firstVisibleIndex = virtualItems[0].index;
		for (let i = firstVisibleIndex; i >= 0; i--) {
			if (flattenedItems[i]?.type === "header") {
				return i;
			}
		}
		return null;
	}, [virtualItems, flattenedItems]);

	const sourceText = source === "json" ? "JSON" : "Calendar";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-border/50 bg-background max-h-[90vh] rounded-2xl shadow-2xl sm:max-w-md">
				<DialogHeader className="shrink-0 p-0 pb-4">
					<DialogTitle className="text-foreground font-sans text-2xl font-bold tracking-wide">
						Import from {sourceText}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						We found {foundBirthdays.length} birthday{foundBirthdays.length === 1 ? "" : "s"} in the
						file. Select the ones you'd like to import into {APP_INFO.name}.
					</DialogDescription>
					{foundBirthdays.length > 0 && (
						<div className="flex items-center justify-between">
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

				<div className="relative flex-1 overflow-hidden">
					{foundBirthdays.length === 0 ? (
						<div className="text-muted-foreground px-6 py-12 text-center italic">
							No birthdays found in the selected file.
						</div>
					) : (
						<div
							ref={parentRef}
							className="custom-scrollbar h-full w-full overflow-y-auto pr-4"
							style={{ maxHeight: "50vh" }}
						>
							{/* Sticky Header Container */}
							{activeStickyIndex !== null && (
								<div className="bg-background absolute top-0 z-20 flex w-full items-center justify-between pt-2 pb-2 shadow-[0_4px_10px_-10px_rgba(0,0,0,0.5)]">
									<h4 className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
										{
											(
												flattenedItems[activeStickyIndex] as Extract<
													VirtualItem,
													{ type: "header" }
												>
											).month
										}
									</h4>
									{(() => {
										const item = flattenedItems[activeStickyIndex] as Extract<
											VirtualItem,
											{ type: "header" }
										>;
										const selectableInMonth = item.celebrants.filter((b) => !isDuplicate(b));
										const allSelectedInMonth =
											selectableInMonth.length > 0 &&
											selectableInMonth.every((b) => selectedIds.has(b.id));
										const celebrantIds = selectableInMonth.map((b) => b.id);
										return (
											<Button
												variant="ghost"
												size="sm"
												className="text-primary h-auto p-0 text-xs hover:bg-transparent"
												onClick={() => toggleMonth(celebrantIds, allSelectedInMonth)}
											>
												{allSelectedInMonth ? "Deselect All" : "Select All"}
											</Button>
										);
									})()}
								</div>
							)}

							<div
								style={{
									height: `${rowVirtualizer.getTotalSize()}px`,
									width: "100%",
									position: "relative",
								}}
							>
								{virtualItems.map((virtualRow) => {
									const item = flattenedItems[virtualRow.index];

									if (item.type === "header") {
										const selectableInMonth = item.celebrants.filter((b) => !isDuplicate(b));
										const allSelectedInMonth =
											selectableInMonth.length > 0 &&
											selectableInMonth.every((b) => selectedIds.has(b.id));
										const celebrantIds = selectableInMonth.map((b) => b.id);

										return (
											<VirtualHeaderRow
												key={virtualRow.index}
												item={item}
												virtualRow={virtualRow}
												allSelectedInMonth={allSelectedInMonth}
												toggleMonth={() => toggleMonth(celebrantIds, allSelectedInMonth)}
											/>
										);
									}

									// Birthday Row
									const b = item.birthday;
									const duplicate = isDuplicate(b);
									const isSelected = selectedIds.has(b.id);
									const isBday = isCelebrating(b.birthday);

									return (
										<VirtualBirthdayRow
											key={virtualRow.index}
											b={b}
											virtualRow={virtualRow}
											duplicate={duplicate}
											isSelected={isSelected}
											isBday={isBday}
											toggleSelection={toggleSelection}
										/>
									);
								})}
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="border-border/50 shrink-0 border-t p-6 pt-4">
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
