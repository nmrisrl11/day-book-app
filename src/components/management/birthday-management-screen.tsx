import { useState, useMemo } from "react";
import { useDayBook } from "@/context/day-book-context";
import { BirthdayListItem } from "./birthday-list-item";
import { BirthdayFormModal } from "./birthday-form-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import type { Birthday } from "@/types/birthday";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function BirthdayManagementScreen() {
	const { birthdays, deleteBirthday } = useDayBook();

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deletingBirthday, setDeletingBirthday] = useState<Birthday | null>(null);

	const [searchQuery, setSearchQuery] = useState("");
	const [monthFilter, setMonthFilter] = useState("all");
	const [sortOption, setSortOption] = useState("upcoming");

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
								placeholder="Search by name..."
								className="bg-background pl-9"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="flex gap-2">
							<Select value={monthFilter} onValueChange={setMonthFilter}>
								<SelectTrigger className="bg-background w-32.5">
									<SelectValue placeholder="Month" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Months</SelectItem>
									<SelectItem value="1">January</SelectItem>
									<SelectItem value="2">February</SelectItem>
									<SelectItem value="3">March</SelectItem>
									<SelectItem value="4">April</SelectItem>
									<SelectItem value="5">May</SelectItem>
									<SelectItem value="6">June</SelectItem>
									<SelectItem value="7">July</SelectItem>
									<SelectItem value="8">August</SelectItem>
									<SelectItem value="9">September</SelectItem>
									<SelectItem value="10">October</SelectItem>
									<SelectItem value="11">November</SelectItem>
									<SelectItem value="12">December</SelectItem>
								</SelectContent>
							</Select>
							<Select value={sortOption} onValueChange={setSortOption}>
								<SelectTrigger className="bg-background w-40">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
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
								{filteredAndSortedBirthdays.map((birthday) => (
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
				</div>
			)}

			<BirthdayFormModal
				open={formModalOpen}
				onOpenChange={setFormModalOpen}
				birthday={editingBirthday}
			/>

			<DeleteConfirmationModal
				open={deleteModalOpen}
				onOpenChange={setDeleteModalOpen}
				onConfirm={handleConfirmDelete}
				birthdayName={deletingBirthday?.name}
			/>
		</div>
	);
}
