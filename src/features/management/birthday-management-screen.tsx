import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronLeftIcon, ChevronRightIcon, LinkIcon, PlusIcon } from "lucide-react";
import { lazy, Suspense, useRef } from "react";

import { BirthdayFilters } from "./components/birthday-filters";
import { BirthdayListItem } from "./components/birthday-list-item";
import { BulkActionBar } from "./components/bulk-action-bar";
import { ManageEmptyState } from "./components/manage-empty-state";
import { ManageRouteFallback } from "./components/manage-route-fallback";

import { PER_PAGE_OPTIONS, useBirthdayManagement } from "./hooks/use-birthday-management";
import { useModalManager } from "./hooks/use-modal-manager";

const BirthdayFormModal = lazy(() =>
	import("./components/birthday-form-modal").then((m) => ({ default: m.BirthdayFormModal })),
);
const ActionConfirmationModal = lazy(() =>
	import("@/components/action-confirmation-modal").then((m) => ({
		default: m.ActionConfirmationModal,
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
		currentDate,
	} = useBirthdayManagement();

	const modalManager = useModalManager({ selectedIds, setSelectedIds });

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
					<Button
						variant="outline"
						onClick={() => modalManager.setAskModalOpen(true)}
						aria-label="Ask for Birthday"
					>
						<LinkIcon className="h-4 w-4 sm:mr-2" aria-hidden="true" />
						<span className="hidden sm:inline">Ask for Birthday</span>
					</Button>
					<Button onClick={modalManager.handleAdd} aria-label="Add Birthday">
						<PlusIcon className="h-4 w-4 sm:mr-2" aria-hidden="true" />
						<span className="hidden sm:inline">Add Birthday</span>
					</Button>
				</div>
			</div>

			{birthdays.length === 0 ? (
				<ManageEmptyState onAdd={modalManager.handleAdd} />
			) : (
				<div className="flex flex-col gap-4">
					<BirthdayFilters
						localSearch={localSearch}
						setLocalSearch={setLocalSearch}
						monthFilter={monthFilter}
						setMonthFilter={setMonthFilter}
						relationshipFilter={relationshipFilter}
						setRelationshipFilter={setRelationshipFilter}
						sortOption={sortOption}
						setSortOption={setSortOption}
						isFiltersActive={isFiltersActive}
						handleClearFilters={handleClearFilters}
					/>

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
												onEdit={modalManager.handleEdit}
												onDelete={modalManager.handleDeleteClick}
												onExport={modalManager.handleExport}
												selectable={true}
												selected={selectedIds.has(birthday.id)}
												onSelectChange={handleSelectChange}
												currentDate={currentDate}
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

			{modalManager.formModalOpen && (
				<Suspense fallback={null}>
					<BirthdayFormModal
						open={modalManager.formModalOpen}
						onOpenChange={modalManager.setFormModalOpen}
						birthday={modalManager.editingBirthday}
					/>
				</Suspense>
			)}

			{modalManager.deleteModalOpen && (
				<Suspense fallback={null}>
					<ActionConfirmationModal
						open={modalManager.deleteModalOpen}
						onOpenChange={modalManager.setDeleteModalOpen}
						title="Delete Birthday"
						description={
							<p>
								Are you sure you want to delete the birthday for{" "}
								<span className="text-foreground font-semibold">
									{modalManager.deletingBirthday?.name}
								</span>
								? This action cannot be undone.
							</p>
						}
						footer={
							<>
								<Button
									id="cancel-delete-btn"
									variant="ghost"
									onClick={() => modalManager.setDeleteModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={modalManager.handleConfirmDelete}
									aria-label="Delete"
								>
									Delete
								</Button>
							</>
						}
					/>
				</Suspense>
			)}

			{modalManager.exportModalOpen && modalManager.exportingBirthday && (
				<Suspense fallback={null}>
					<CalendarExportDialog
						open={modalManager.exportModalOpen}
						onOpenChange={modalManager.setExportModalOpen}
						birthdays={modalManager.exportingBirthday}
					/>
				</Suspense>
			)}

			{modalManager.bulkDeleteModalOpen && (
				<Suspense fallback={null}>
					<ActionConfirmationModal
						open={modalManager.bulkDeleteModalOpen}
						onOpenChange={modalManager.setBulkDeleteModalOpen}
						title="Delete Selected Birthdays?"
						description={
							<p>
								Are you sure you want to delete{" "}
								<span className="text-foreground font-semibold">
									{selectedIds.size} {selectedIds.size === 1 ? "birthday" : "birthdays"}
								</span>
								? This cannot be undone.
							</p>
						}
						footer={
							<>
								<Button
									id="cancel-delete-btn"
									variant="ghost"
									onClick={() => modalManager.setBulkDeleteModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={modalManager.executeBulkDelete}
									aria-label="Delete Selected"
								>
									Delete Selected
								</Button>
							</>
						}
					/>
				</Suspense>
			)}

			{modalManager.askModalOpen && (
				<Suspense fallback={null}>
					<AskBirthdayModal
						open={modalManager.askModalOpen}
						onOpenChange={modalManager.setAskModalOpen}
					/>
				</Suspense>
			)}

			<BulkActionBar
				selectedIds={selectedIds}
				setSelectedIds={setSelectedIds}
				handleBulkDelete={modalManager.handleBulkDelete}
			/>
		</div>
	);
}
