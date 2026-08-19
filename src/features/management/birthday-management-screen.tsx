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
import { useDayBookStore } from "@/store/day-book-store";
import { RELATIONSHIP_OPTIONS, type Birthday } from "@/types/birthday";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	FilterXIcon,
	LinkIcon,
	PlusIcon,
	SearchIcon,
} from "lucide-react";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BirthdayListItem } from "./components/birthday-list-item";
import { gooeyToast } from "goey-toast";

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

export function BirthdayManagementScreen() {
	const { birthdays, deleteBirthday, updateBirthdays } = useDayBookStore();

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deletingBirthday, setDeletingBirthday] = useState<Birthday | null>(null);

	const [exportModalOpen, setExportModalOpen] = useState(false);
	const [exportingBirthday, setExportingBirthday] = useState<Birthday | null>(null);

	const [askModalOpen, setAskModalOpen] = useState(false);

	const MONTH_OPTIONS = [
		"all",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12",
	] as const;
	const SORT_OPTIONS = ["upcoming", "name-asc", "name-desc", "date-asc", "date-desc"] as const;
	const PER_PAGE_OPTIONS = ["10", "20", "50", "100", "all"] as const;

	const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
	const [monthFilter, setMonthFilter] = useQueryState(
		"month",
		parseAsStringLiteral(MONTH_OPTIONS).withDefault("all"),
	);
	const [relationshipFilter, setRelationshipFilter] = useQueryState(
		"relationship",
		parseAsString.withDefault("all"),
	);
	const [sortOption, setSortOption] = useQueryState(
		"sort",
		parseAsStringLiteral(SORT_OPTIONS).withDefault("upcoming"),
	);

	const [currentPage, setCurrentPage] = useQueryState("page", parseAsInteger.withDefault(1));
	const [itemsPerPage, setItemsPerPage] = useQueryState(
		"perPage",
		parseAsStringLiteral(PER_PAGE_OPTIONS).withDefault("10"),
	);

	const [localSearch, setLocalSearch] = useState(searchQuery);

	useEffect(() => {
		setLocalSearch(searchQuery);
	}, [searchQuery]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (localSearch !== searchQuery) {
				setSearchQuery(localSearch);
			}
		}, 300);
		return () => clearTimeout(timeout);
	}, [localSearch, setSearchQuery, searchQuery]);

	const isFiltersActive =
		searchQuery !== "" ||
		monthFilter !== "all" ||
		relationshipFilter !== "all" ||
		sortOption !== "upcoming" ||
		itemsPerPage !== "10";

	const handleClearFilters = () => {
		setLocalSearch("");
		setSearchQuery("");
		setMonthFilter("all");
		setRelationshipFilter("all");
		setSortOption("upcoming");
		setItemsPerPage("10");
		setCurrentPage(1);
	};

	const prevDeps = useRef({
		birthdays,
		searchQuery,
		monthFilter,
		relationshipFilter,
		sortOption,
		itemsPerPage,
	});

	useEffect(() => {
		const prev = prevDeps.current;
		const hasChanged =
			prev.birthdays !== birthdays ||
			prev.searchQuery !== searchQuery ||
			prev.monthFilter !== monthFilter ||
			prev.relationshipFilter !== relationshipFilter ||
			prev.sortOption !== sortOption ||
			prev.itemsPerPage !== itemsPerPage;

		if (hasChanged) {
			setCurrentPage(1);
			setSelectedIds(new Set());
			prevDeps.current = {
				birthdays,
				searchQuery,
				monthFilter,
				relationshipFilter,
				sortOption,
				itemsPerPage,
			};
		}
	}, [
		birthdays,
		searchQuery,
		monthFilter,
		relationshipFilter,
		sortOption,
		itemsPerPage,
		setCurrentPage,
	]);

	const handleSelectChange = useCallback((id: string, selected: boolean) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (selected) {
				next.add(id);
			} else {
				next.delete(id);
			}
			return next;
		});
	}, []);

	const filteredAndSortedBirthdays = useMemo(() => {
		let result = [...birthdays];

		// 1. Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter((b) => b.name.toLowerCase().includes(query));
		}

		// 2. Month filter
		if (monthFilter !== "all") {
			result = result.filter((b) => {
				const [, month] = b.birthday.split("-");
				return parseInt(month, 10) === parseInt(monthFilter, 10);
			});
		}

		// 3. Relationship filter
		if (relationshipFilter !== "all") {
			result = result.filter((b) => b.relationship === relationshipFilter);
		}

		// 4. Sort
		const today = new Date();
		const currentMonth = today.getMonth() + 1;
		const currentDay = today.getDate();

		// Pre-calculate sort keys to avoid parsing dates inside the sort comparator
		const mapped = result.map((b) => {
			let timestamp = 0;
			let upcomingTimestamp = 0;

			if (sortOption === "date-asc" || sortOption === "date-desc") {
				timestamp = new Date(b.birthday).getTime();
			} else if (sortOption === "upcoming") {
				const [, m, d] = b.birthday.split("-");
				const month = parseInt(m, 10);
				const day = parseInt(d, 10);
				let year = today.getFullYear();
				if (month < currentMonth || (month === currentMonth && day < currentDay)) {
					year += 1;
				}
				upcomingTimestamp = new Date(year, month - 1, day).getTime();
			}

			return { b, timestamp, upcomingTimestamp };
		});

		mapped.sort((a, b) => {
			if (sortOption === "name-asc") {
				return a.b.name.localeCompare(b.b.name);
			} else if (sortOption === "name-desc") {
				return b.b.name.localeCompare(a.b.name);
			} else if (sortOption === "date-asc") {
				return a.timestamp - b.timestamp;
			} else if (sortOption === "date-desc") {
				return b.timestamp - a.timestamp;
			} else if (sortOption === "upcoming") {
				return a.upcomingTimestamp - b.upcomingTimestamp;
			}
			return 0;
		});

		return mapped.map((item) => item.b);
	}, [birthdays, searchQuery, monthFilter, relationshipFilter, sortOption]);

	const totalPages =
		itemsPerPage === "all"
			? 1
			: Math.max(1, Math.ceil(filteredAndSortedBirthdays.length / parseInt(itemsPerPage, 10)));

	const clampedPage = Math.max(1, Math.min(currentPage, totalPages));

	const paginatedBirthdays = useMemo(() => {
		if (itemsPerPage === "all") return filteredAndSortedBirthdays;
		const size = parseInt(itemsPerPage, 10);
		const start = (clampedPage - 1) * size;
		return filteredAndSortedBirthdays.slice(start, start + size);
	}, [filteredAndSortedBirthdays, clampedPage, itemsPerPage]);

	const generatePageNumbers = () => {
		if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

		if (clampedPage <= 4) {
			return [1, 2, 3, 4, 5, "ellipsis-1", totalPages];
		} else if (clampedPage >= totalPages - 3) {
			return [
				1,
				"ellipsis-1",
				totalPages - 4,
				totalPages - 3,
				totalPages - 2,
				totalPages - 1,
				totalPages,
			];
		} else {
			return [
				1,
				"ellipsis-1",
				clampedPage - 1,
				clampedPage,
				clampedPage + 1,
				"ellipsis-2",
				totalPages,
			];
		}
	};

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

	const handleConfirmDelete = () => {
		if (deletingBirthday) {
			deleteBirthday(deletingBirthday.id);
			setDeleteModalOpen(false);
			setDeletingBirthday(null);
		}
	};

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-foreground px-2 text-2xl font-bold tracking-tight">Manage Birthdays</h2>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={() => setAskModalOpen(true)}>
						<LinkIcon className="mr-2 h-4 w-4" />
						<span className="hidden sm:inline">Ask for Birthday</span>
					</Button>
					<Button onClick={handleAdd}>
						<PlusIcon className="mr-2 h-4 w-4" />
						<span className="hidden sm:inline">Add Birthday</span>
						<span className="sm:hidden">Add</span>
					</Button>
				</div>
			</div>

			{birthdays.length === 0 ? (
				<div className="border-border bg-card/50 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-4 py-16 text-center">
					<div className="text-4xl">🎂</div>
					<div className="max-w-md">
						<h3 className="mb-2 text-lg font-semibold">No birthdays yet</h3>
						<p className="text-muted-foreground mb-6">
							Keep track of your family and friends' birthdays so you never forget one again.
						</p>
						<Button onClick={handleAdd}>Add Your First Birthday</Button>
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
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
									<FilterXIcon className="h-4 w-4" />
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

					<div className="custom-scrollbar max-h-[55vh] overflow-y-auto pr-4">
						{filteredAndSortedBirthdays.length === 0 ? (
							<div className="text-muted-foreground py-12 text-center italic">
								No birthdays found matching your criteria.
							</div>
						) : (
							<div className="flex flex-col gap-3 pb-8">
								{paginatedBirthdays.map((birthday) => (
									<BirthdayListItem
										key={birthday.id}
										birthday={birthday}
										onEdit={handleEdit}
										onDelete={handleDeleteClick}
										onExport={handleExport}
										selectable={true}
										selected={selectedIds.has(birthday.id)}
										onSelectChange={handleSelectChange}
									/>
								))}
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
										<ChevronLeftIcon className="h-4 w-4" />
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
										<ChevronRightIcon className="h-4 w-4" />
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
						onValueChange={(val) => {
							const count = selectedIds.size;
							updateBirthdays(Array.from(selectedIds), { relationship: val as any });
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
