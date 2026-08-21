import { useDayBookStore } from "@/store/day-book-store";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

export const MONTH_OPTIONS = [
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
export const SORT_OPTIONS = ["upcoming", "name-asc", "name-desc", "date-asc", "date-desc"] as const;
export const PER_PAGE_OPTIONS = ["10", "20", "50", "100", "all"] as const;

export function useBirthdayManagement() {
	const { birthdays } = useDayBookStore();

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

	const handleClearFilters = useCallback(() => {
		setLocalSearch("");
		setSearchQuery("");
		setMonthFilter("all");
		setRelationshipFilter("all");
		setSortOption("upcoming");
		setItemsPerPage("10");
		setCurrentPage(1);
	}, [
		setSearchQuery,
		setMonthFilter,
		setRelationshipFilter,
		setSortOption,
		setItemsPerPage,
		setCurrentPage,
	]);

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

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter((b) => b.name.toLowerCase().includes(query));
		}

		if (monthFilter !== "all") {
			result = result.filter((b) => {
				const [, month] = b.birthday.split("-");
				return parseInt(month, 10) === parseInt(monthFilter, 10);
			});
		}

		if (relationshipFilter !== "all") {
			result = result.filter((b) => b.relationship === relationshipFilter);
		}

		const today = new Date();
		const currentMonth = today.getMonth() + 1;
		const currentDay = today.getDate();

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

	const generatePageNumbers = useCallback(() => {
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
	}, [totalPages, clampedPage]);

	return {
		searchQuery,
		setSearchQuery,
		localSearch,
		setLocalSearch,
		monthFilter,
		setMonthFilter,
		relationshipFilter,
		setRelationshipFilter,
		sortOption,
		setSortOption,
		currentPage,
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
	};
}
