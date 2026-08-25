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
import type { InvitationRecord } from "@/lib/db";
import { InvitationRepository } from "@/lib/invitation-repository";
import { useVirtualizer } from "@tanstack/react-virtual";
import { gooeyToast } from "goey-toast";
import { ChevronLeftIcon, ChevronRightIcon, LinkIcon } from "lucide-react";
import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { InvitationEmptyState } from "./components/invitation-empty-state";
import { InvitationListItem } from "./components/invitation-list-item";
import { InvitationRouteFallback } from "./components/invitation-route-fallback";
import {
	INVITATION_PER_PAGE_OPTIONS,
	INVITATION_SORT_OPTIONS,
	useInvitationManagement,
} from "./hooks/use-invitation-management";

const AskBirthdayModal = lazy(() =>
	import("../management/components/ask-birthday-modal").then((m) => ({
		default: m.AskBirthdayModal,
	})),
);

const ActionConfirmationModal = lazy(() =>
	import("@/components/action-confirmation-modal").then((m) => ({
		default: m.ActionConfirmationModal,
	})),
);

export function InvitationManagementScreen() {
	const {
		sortedInvitations,
		paginatedInvitations,
		sortOption,
		setSortOption,
		selectedIds,
		setSelectedIds,
		handleSelectChange,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		totalPages,
		generatePageNumbers,
		clampedPage,
		isLoading,
	} = useInvitationManagement();

	const [askModalOpen, setAskModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
	const [invitationToDelete, setInvitationToDelete] = useState<InvitationRecord | null>(null);

	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: paginatedInvitations.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 88,
		overscan: 10,
	});

	const confirmDelete = useCallback((invitation: InvitationRecord) => {
		setInvitationToDelete(invitation);
		setDeleteModalOpen(true);
	}, []);

	const executeDelete = async () => {
		if (invitationToDelete) {
			await InvitationRepository.delete(invitationToDelete.id);
			gooeyToast.success("Invitation deleted", { showTimestamp: false });
			setDeleteModalOpen(false);
			setInvitationToDelete(null);
		}
	};

	const handleBulkDelete = () => {
		setBulkDeleteModalOpen(true);
	};

	const executeBulkDelete = async () => {
		await InvitationRepository.bulkDelete(Array.from(selectedIds));
		setSelectedIds(new Set());
		setBulkDeleteModalOpen(false);
		gooeyToast.success(`${selectedIds.size} invitations deleted`);
	};

	if (isLoading) {
		return <InvitationRouteFallback />;
	}

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-foreground px-2 text-2xl font-bold tracking-tight">Invitation Links</h2>
				<Button onClick={() => setAskModalOpen(true)}>
					<LinkIcon className="h-4 w-4 sm:mr-2" aria-hidden="true" />
					<span className="hidden sm:inline">Ask for Birthday</span>
				</Button>
			</div>

			{sortedInvitations.length === 0 ? (
				<InvitationEmptyState onAdd={() => setAskModalOpen(true)} />
			) : (
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
						<div className="flex flex-wrap items-center gap-2">
							<Select
								value={sortOption}
								onValueChange={(val) =>
									setSortOption(val as (typeof INVITATION_SORT_OPTIONS)[number])
								}
							>
								<SelectTrigger className="bg-background w-40" aria-label="Sort invitations">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="date-desc">Newest First</SelectItem>
									<SelectItem value="date-asc">Oldest First</SelectItem>
									<SelectItem value="status">Status (Active First)</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex items-center justify-between px-1 py-2">
						<div className="flex items-center gap-2">
							<Checkbox
								id="select-all-invitations"
								checked={
									paginatedInvitations.length > 0 &&
									selectedIds.size === paginatedInvitations.length
								}
								onCheckedChange={(checked) => {
									if (checked) {
										setSelectedIds(new Set(paginatedInvitations.map((b) => b.id)));
									} else {
										setSelectedIds(new Set());
									}
								}}
							/>
							<Label
								htmlFor="select-all-invitations"
								className="cursor-pointer text-sm font-medium"
							>
								Select All
							</Label>
						</div>
						<div className="text-muted-foreground text-sm">{sortedInvitations.length} items</div>
					</div>

					<div ref={parentRef} className="custom-scrollbar max-h-[55vh] overflow-y-auto pr-4">
						<div
							style={{
								height: `${rowVirtualizer.getTotalSize()}px`,
								width: "100%",
								position: "relative",
							}}
							className="pb-8"
						>
							{rowVirtualizer.getVirtualItems().map((virtualRow) => {
								const inv = paginatedInvitations[virtualRow.index];
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
										<InvitationListItem
											invitation={inv}
											selectable
											selected={selectedIds.has(inv.id)}
											onSelectChange={handleSelectChange}
											onDelete={confirmDelete}
										/>
									</div>
								);
							})}
						</div>
					</div>

					{sortedInvitations.length > 0 && (
						<div className="mt-2 flex flex-col items-center justify-between gap-4 pb-8 sm:flex-row">
							<div className="flex items-center gap-2 text-sm">
								<span className="text-muted-foreground">Show</span>
								<Select
									value={itemsPerPage}
									onValueChange={(val) =>
										setItemsPerPage(val as (typeof INVITATION_PER_PAGE_OPTIONS)[number])
									}
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

			{askModalOpen && (
				<Suspense fallback={null}>
					<AskBirthdayModal open={askModalOpen} onOpenChange={setAskModalOpen} />
				</Suspense>
			)}

			{deleteModalOpen && (
				<Suspense fallback={null}>
					<ActionConfirmationModal
						open={deleteModalOpen}
						onOpenChange={(open) => {
							if (!open) {
								setDeleteModalOpen(false);
								setInvitationToDelete(null);
							}
						}}
						title="Delete Invitation Link?"
						description={
							<p>
								{invitationToDelete ? (
									<>
										Are you sure you want to delete{" "}
										<span className="text-foreground font-semibold">
											{invitationToDelete.name}'s Invitation
										</span>
										? This cannot be undone.
									</>
								) : (
									"Are you sure you want to delete this link?"
								)}
							</p>
						}
						footer={
							<>
								<Button
									id="cancel-delete-btn"
									variant="ghost"
									onClick={() => {
										setDeleteModalOpen(false);
										setInvitationToDelete(null);
									}}
								>
									Cancel
								</Button>
								<Button variant="destructive" onClick={executeDelete} aria-label="Delete">
									Delete
								</Button>
							</>
						}
					/>
				</Suspense>
			)}

			{bulkDeleteModalOpen && (
				<Suspense fallback={null}>
					<ActionConfirmationModal
						open={bulkDeleteModalOpen}
						onOpenChange={setBulkDeleteModalOpen}
						title="Delete Selected Invitations?"
						description={
							<p>
								Are you sure you want to delete{" "}
								<span className="text-foreground font-semibold">
									{selectedIds.size} invitations
								</span>
								? This cannot be undone.
							</p>
						}
						footer={
							<>
								<Button
									id="cancel-delete-btn"
									variant="ghost"
									onClick={() => setBulkDeleteModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={executeBulkDelete}
									aria-label="Delete Selected"
								>
									Delete Selected
								</Button>
							</>
						}
					/>
				</Suspense>
			)}

			{selectedIds.size > 0 && (
				<div className="bg-popover text-popover-foreground animate-in fade-in slide-in-from-bottom-4 fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border px-4 py-2 shadow-lg">
					<div className="text-sm font-medium whitespace-nowrap">{selectedIds.size} selected</div>
					<div className="bg-border h-4 w-px" />
					<Button
						variant="destructive"
						size="sm"
						className="h-8 rounded-full px-3"
						onClick={handleBulkDelete}
					>
						Delete Selected
					</Button>
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
