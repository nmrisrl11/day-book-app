import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FULL_MONTHS } from "@/constants/months";
import { BirthdayRepository } from "@/lib/birthday-repository";
import { RELATIONSHIP_OPTIONS, type Birthday } from "@/types/birthday";
import { useVirtualizer } from "@tanstack/react-virtual";
import { gooeyToast } from "goey-toast";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	FilterXIcon,
	LinkIcon,
	PlusIcon,
	SearchIcon,
} from "lucide-react";
import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { BirthdayListItem } from "./components/birthday-list-item";

import {
	MONTH_OPTIONS,
	PER_PAGE_OPTIONS,
	SORT_OPTIONS,
	useBirthdayManagement,
} from "./hooks/use-birthday-management";
const BirthdayFormModal = lazy(() =>
	import("./components/birthday-form-modal").then((m) => ({ default: m.BirthdayFormModal })),
);
const DeleteConfirmationModal = lazy(() =>
	import("./components/delete-confirmation-modal").then((m) => ({
		default: m.DeleteConfirmationModal,
	})),
);
const CalendarExportDialog = lazy(() =>
	import("@/features/calendar/components/calendar-export-dialog").then((m) => ({
		default: m.CalendarExportDialog,
	})),
);
const AskBirthdayModal = lazy(() =>
	import("./components/ask-birthday-modal").then((m) => ({ default: m.AskBirthdayModal })),
);

import { ManageEmptyState } from "./components/manage-empty-state";
import { ManageRouteFallback } from "./components/manage-route-fallback";

export function BirthdayManagementScreen() {
	const {
		birthdays,
		localSearch,
		setLocalSearch,
		monthFilter,
		setMonthFilter,
		relationshipFilter,
		setRelationshipFilter,
		sortOption,
		setSortOption,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		selectedIds,
		setSelectedIds,
		handleSelectChange,
		isFiltersActive,
		handleClearFilters,
		filteredAndSortedBirthdays,
		paginatedBirthdays,
		totalPages,
		clampedPage,
		generatePageNumbers,
		isLoading,
	} = useBirthdayManagement();

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deletingBirthday, setDeletingBirthday] = useState<Birthday | null>(null);

	const [exportModalOpen, setExportModalOpen] = useState(false);
	const [exportingBirthday, setExportingBirthday] = useState<Birthday | null>(null);

	const [askModalOpen, setAskModalOpen] = useState(false);

	const handleAdd = () => {
		setEditingBirthday(null);
		setFormModalOpen(true);
	};

	const handleEdit = useCallback((birthday: Birthday) => {
		setEditingBirthday(birthday);
		setFormModalOpen(true);
	}, []);

	const handleDeleteClick = useCallback((birthday: Birthday) => {
		setDeletingBirthday(birthday);
		setDeleteModalOpen(true);
	}, []);

	const handleExport = useCallback((birthday: Birthday) => {
		setExportingBirthday(birthday);
		setExportModalOpen(true);
	}, []);

	const handleConfirmDelete = async () => {
		if (deletingBirthday) {
			await BirthdayRepository.delete(deletingBirthday.id);
			setDeleteModalOpen(false);
			setDeletingBirthday(null);
		}
	};

	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: paginatedBirthdays.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 88,
		overscan: 10,
	});

	if (isLoading) {
		return <ManageRouteFallback />;
	}

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-foreground px-2 text-2xl font-bold tracking-tight">Manage Birthdays</h2>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={() => setAskModalOpen(true)}>
						<LinkIcon className="mr-2 h-4 w-4" aria-hidden="true" />
						<span className="hidden sm:inline">Ask for Birthday</span>
					</Button>
					<Button onClick={handleAdd}>
						<PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
						<span className="hidden sm:inline">Add Birthday</span>
						<span className="sm:hidden">Add</span>
					</Button>
				</div>
			</div>

			{birthdays.length === 0 ? (
				<ManageEmptyState onAdd={handleAdd} />
			) : (
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<SearchIcon
								className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
								aria-hidden="true"
							/>
							<Input
								id="search-birthdays"
								name="search-birthdays"
								placeholder="Search by name..."
								className="bg-background pl-9"
								value={localSearch}
								onChange={(e) => setLocalSearch(e.target.value)}
								aria-label="Search by name"
								autoComplete="off"
							/>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Select
								value={monthFilter}
								onValueChange={(val) => setMonthFilter(val as (typeof MONTH_OPTIONS)[number])}
							>
								<SelectTrigger className="bg-background w-32.5" aria-label="Filter by month">
									<SelectValue placeholder="Month" />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="all">All Months</SelectItem>
									{FULL_MONTHS.map((month, index) => (
										<SelectItem key={month} value={(index + 1).toString()}>
											{month}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								value={relationshipFilter}
								onValueChange={(val) => setRelationshipFilter(val)}
							>
								<SelectTrigger className="bg-background w-32.5" aria-label="Filter by relationship">
									<SelectValue placeholder="Relationship" />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="all">All People</SelectItem>
									{RELATIONSHIP_OPTIONS.map((option) => (
										<SelectItem key={option} value={option}>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								value={sortOption}
								onValueChange={(val) => setSortOption(val as (typeof SORT_OPTIONS)[number])}
							>
								<SelectTrigger className="bg-background w-40" aria-label="Sort birthdays">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="upcoming">Upcoming First</SelectItem>
									<SelectItem value="name-asc">Name (A-Z)</SelectItem>
									<SelectItem value="name-desc">Name (Z-A)</SelectItem>
									<SelectItem value="date-asc">Oldest to Youngest</SelectItem>
									<SelectItem value="date-desc">Youngest to Oldest</SelectItem>
								</SelectContent>
							</Select>

							{isFiltersActive && (
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
									onClick={handleClearFilters}
									aria-label="Clear all filters"
									title="Clear all filters"
								>
									<FilterXIcon className="h-4 w-4" aria-hidden="true" />
								</Button>
							)}
						</div>
					</div>

					{filteredAndSortedBirthdays.length > 0 && (
						<div className="flex items-center justify-between px-1 py-2">
							<div className="flex items-center gap-2">
								<Checkbox
									id="select-all"
									checked={
										filteredAndSortedBirthdays.length > 0 &&
										selectedIds.size === filteredAndSortedBirthdays.length
									}
									onCheckedChange={(checked) => {
										if (checked) {
											setSelectedIds(new Set(filteredAndSortedBirthdays.map((b) => b.id)));
										} else {
											setSelectedIds(new Set());
										}
									}}
								/>
								<Label htmlFor="select-all" className="cursor-pointer text-sm font-medium">
									Select All
								</Label>
							</div>
							<div className="text-muted-foreground text-sm">
								{filteredAndSortedBirthdays.length} items
							</div>
						</div>
					)}

					<div ref={parentRef} className="custom-scrollbar max-h-[55vh] overflow-y-auto pr-4">
						{filteredAndSortedBirthdays.length === 0 ? (
							<div className="text-muted-foreground py-12 text-center italic">
								No birthdays found matching your criteria.
							</div>
						) : (
							<div
								style={{
									height: `${rowVirtualizer.getTotalSize()}px`,
									width: "100%",
									position: "relative",
								}}
								className="pb-8"
							>
								{rowVirtualizer.getVirtualItems().map((virtualRow) => {
									const birthday = paginatedBirthdays[virtualRow.index];
									return (
										<div
											key={virtualRow.index}
											style={{
												position: "absolute",
												top: 0,
												left: 0,
												width: "100%",
												height: `${virtualRow.size}px`,
												transform: `translateY(${virtualRow.start}px)`,
												paddingBottom: "12px",
											}}
										>
											<BirthdayListItem
												birthday={birthday}
												onEdit={handleEdit}
												onDelete={handleDeleteClick}
												onExport={handleExport}
												selectable={true}
												selected={selectedIds.has(birthday.id)}
												onSelectChange={handleSelectChange}
											/>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{filteredAndSortedBirthdays.length > 0 && (
						<div className="mt-2 flex flex-col items-center justify-between gap-4 sm:flex-row">
							<div className="text-muted-foreground flex items-center gap-2 text-sm">
								<span>Show</span>
								<Select
									value={itemsPerPage}
									onValueChange={(val) => setItemsPerPage(val as (typeof PER_PAGE_OPTIONS)[number])}
								>
									<SelectTrigger className="h-8 w-17.5">
										<SelectValue placeholder="10" />
									</SelectTrigger>
									<SelectContent position="popper">
										<SelectItem value="10">10</SelectItem>
										<SelectItem value="20">20</SelectItem>
										<SelectItem value="50">50</SelectItem>
										<SelectItem value="100">100</SelectItem>
										<SelectItem value="all">All</SelectItem>
									</SelectContent>
								</Select>
								<span>items</span>
							</div>

							{itemsPerPage !== "all" && totalPages > 1 && (
								<div className="flex items-center gap-1">
									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8"
										onClick={() => setCurrentPage(clampedPage - 1)}
										disabled={clampedPage <= 1}
										aria-label="Previous page"
									>
										<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
									</Button>

									{generatePageNumbers().map((page, index) => {
										if (typeof page === "string") {
											return (
												<span key={page} className="text-muted-foreground px-2">
													...
												</span>
											);
										}
										return (
											<Button
												key={index}
												variant={clampedPage === page ? "default" : "ghost"}
												size="icon"
												className="h-8 w-8 text-sm"
												onClick={() => setCurrentPage(page)}
												aria-label={`Go to page ${page}`}
												aria-current={clampedPage === page ? "page" : undefined}
											>
												{page}
											</Button>
										);
									})}

									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8"
										onClick={() => setCurrentPage(clampedPage + 1)}
										disabled={clampedPage >= totalPages}
										aria-label="Next page"
									>
										<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			)}

			{formModalOpen && (
				<Suspense fallback={null}>
					<BirthdayFormModal
						open={formModalOpen}
						onOpenChange={setFormModalOpen}
						birthday={editingBirthday}
					/>
				</Suspense>
			)}

			{deleteModalOpen && (
				<Suspense fallback={null}>
					<DeleteConfirmationModal
						open={deleteModalOpen}
						onOpenChange={setDeleteModalOpen}
						onConfirm={handleConfirmDelete}
						birthdayName={deletingBirthday?.name}
					/>
				</Suspense>
			)}

			{exportModalOpen && exportingBirthday && (
				<Suspense fallback={null}>
					<CalendarExportDialog
						open={exportModalOpen}
						onOpenChange={setExportModalOpen}
						birthdays={exportingBirthday}
					/>
				</Suspense>
			)}

			{askModalOpen && (
				<Suspense fallback={null}>
					<AskBirthdayModal open={askModalOpen} onOpenChange={setAskModalOpen} />
				</Suspense>
			)}

			{selectedIds.size > 0 && (
				<div className="bg-popover text-popover-foreground animate-in fade-in slide-in-from-bottom-4 fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border px-4 py-2 shadow-lg">
					<div className="text-sm font-medium whitespace-nowrap">{selectedIds.size} selected</div>
					<div className="bg-border h-4 w-px" />
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
								description: `${count} people are now marked as ${val}.`,
								showTimestamp: false,
								classNames: {
									content: "items-center text-center",
									title: "text-center w-full",
									description: "text-center justify-center flex w-full",
								},
							});
						}}
					>
						<SelectTrigger className="h-8 w-40 border-none bg-transparent px-2 shadow-none focus:ring-0">
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
					<div className="bg-border h-4 w-px" />
					<Button
						variant="ghost"
						size="sm"
						className="hover:bg-muted h-8 rounded-full px-3"
						onClick={() => setSelectedIds(new Set())}
					>
						Clear
					</Button>
				</div>
			)}
		</div>
	);
}
