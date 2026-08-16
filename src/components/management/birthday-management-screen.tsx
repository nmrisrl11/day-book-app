import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FULL_MONTHS } from "@/constants/months";
import { useDayBookStore } from "@/store/day-book-store";
import type { Birthday } from "@/types/birthday";
import { ChevronLeft, ChevronRight, MoreHorizontal, PlusIcon, SearchIcon } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { BirthdayListItem } from "./birthday-list-item";

const BirthdayFormModal = lazy(() =>
	import("./birthday-form-modal").then((m) => ({ default: m.BirthdayFormModal })),
);
const DeleteConfirmationModal = lazy(() =>
	import("./delete-confirmation-modal").then((m) => ({ default: m.DeleteConfirmationModal })),
);

export function BirthdayManagementScreen() {
	const { birthdays, deleteBirthday } = useDayBookStore();

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deletingBirthday, setDeletingBirthday] = useState<Birthday | null>(null);

	const [searchQuery, setSearchQuery] = useState("");
	const [monthFilter, setMonthFilter] = useState("all");
	const [sortOption, setSortOption] = useState("upcoming");

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState("10");

	useEffect(() => {
		setCurrentPage(1);
	}, [birthdays, searchQuery, monthFilter, sortOption, itemsPerPage]);

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

		// 3. Sort
		const today = new Date();
		const currentMonth = today.getMonth() + 1;
		const currentDay = today.getDate();

		result.sort((a, b) => {
			if (sortOption === "name-asc") {
				return a.name.localeCompare(b.name);
			} else if (sortOption === "name-desc") {
				return b.name.localeCompare(a.name);
			} else if (sortOption === "date-asc") {
				return new Date(a.birthday).getTime() - new Date(b.birthday).getTime();
			} else if (sortOption === "date-desc") {
				return new Date(b.birthday).getTime() - new Date(a.birthday).getTime();
			} else if (sortOption === "upcoming") {
				const getNextBirthday = (dateStr: string) => {
					const [, m, d] = dateStr.split("-");
					const month = parseInt(m, 10);
					const day = parseInt(d, 10);
					let year = today.getFullYear();
					if (month < currentMonth || (month === currentMonth && day < currentDay)) {
						year += 1;
					}
					return new Date(year, month - 1, day).getTime();
				};
				return getNextBirthday(a.birthday) - getNextBirthday(b.birthday);
			}
			return 0;
		});

		return result;
	}, [birthdays, searchQuery, monthFilter, sortOption]);

	const totalPages =
		itemsPerPage === "all"
			? 1
			: Math.ceil(filteredAndSortedBirthdays.length / parseInt(itemsPerPage, 10));

	const paginatedBirthdays = useMemo(() => {
		if (itemsPerPage === "all") return filteredAndSortedBirthdays;
		const size = parseInt(itemsPerPage, 10);
		const start = (currentPage - 1) * size;
		return filteredAndSortedBirthdays.slice(start, start + size);
	}, [filteredAndSortedBirthdays, currentPage, itemsPerPage]);

	const generatePageNumbers = () => {
		if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

		if (currentPage <= 4) {
			return [1, 2, 3, 4, 5, "ellipsis-1", totalPages];
		} else if (currentPage >= totalPages - 3) {
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
				currentPage - 1,
				currentPage,
				currentPage + 1,
				"ellipsis-2",
				totalPages,
			];
		}
	};

	const handleAdd = () => {
		setEditingBirthday(null);
		setFormModalOpen(true);
	};

	const handleEdit = (birthday: Birthday) => {
		setEditingBirthday(birthday);
		setFormModalOpen(true);
	};

	const handleDeleteClick = (birthday: Birthday) => {
		setDeletingBirthday(birthday);
		setDeleteModalOpen(true);
	};

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
				<Button onClick={handleAdd}>
					<PlusIcon className="mr-2 h-4 w-4" />
					Add Birthday
				</Button>
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
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								aria-label="Search by name"
							/>
						</div>
						<div className="flex gap-2">
							<Select value={monthFilter} onValueChange={setMonthFilter}>
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
							<Select value={sortOption} onValueChange={setSortOption}>
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
						</div>
					</div>

					<ScrollArea className="h-[55vh] pr-4">
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
										onEdit={() => handleEdit(birthday)}
										onDelete={() => handleDeleteClick(birthday)}
									/>
								))}
							</div>
						)}
					</ScrollArea>

					{filteredAndSortedBirthdays.length > 0 && (
						<div className="mt-2 flex flex-col items-center justify-between gap-4 sm:flex-row">
							<div className="text-muted-foreground flex items-center gap-2 text-sm">
								<span>Show</span>
								<Select value={itemsPerPage} onValueChange={setItemsPerPage}>
									<SelectTrigger className="h-8 w-17.5">
										<SelectValue placeholder="10" />
									</SelectTrigger>
									<SelectContent position="popper">
										<SelectItem value="10">10</SelectItem>
										<SelectItem value="20">20</SelectItem>
										<SelectItem value="50">50</SelectItem>
										<SelectItem value="all">All</SelectItem>
									</SelectContent>
								</Select>
								<span>items</span>
							</div>

							{itemsPerPage !== "all" && totalPages > 1 && (
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
										disabled={currentPage === 1}
										aria-label="Previous page"
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>

									{generatePageNumbers().map((page, idx) => {
										if (typeof page === "string" && page.startsWith("ellipsis")) {
											return (
												<div key={page} className="flex h-8 w-8 items-center justify-center">
													<MoreHorizontal className="text-muted-foreground h-4 w-4" />
												</div>
											);
										}
										return (
											<Button
												key={idx}
												variant={currentPage === page ? "default" : "ghost"}
												size="icon"
												className="h-8 w-8"
												onClick={() => setCurrentPage(page as number)}
											>
												{page}
											</Button>
										);
									})}

									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
										disabled={currentPage === totalPages}
										aria-label="Next page"
									>
										<ChevronRight className="h-4 w-4" />
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
		</div>
	);
}
