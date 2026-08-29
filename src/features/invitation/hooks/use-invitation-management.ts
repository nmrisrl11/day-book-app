import type { InvitationRecord } from "@/lib/db";
import { InvitationRepository } from "@/lib/invitation-repository";
import { useLiveQuery } from "dexie-react-hooks";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo, useState } from "react";

export const INVITATION_SORT_OPTIONS = ["date-desc", "date-asc", "status"] as const;
export const INVITATION_PER_PAGE_OPTIONS = ["10", "20", "50", "100", "all"] as const;
const EMPTY_INVITATIONS: InvitationRecord[] = [];

export function useInvitationManagement() {
	const invitations = useLiveQuery(() => InvitationRepository.getAll(), []) ?? EMPTY_INVITATIONS;

	const [sortOption, setSortOption] = useQueryState(
		"invSort",
		parseAsStringLiteral([...INVITATION_SORT_OPTIONS]).withDefault("date-desc"),
	);

	const [currentPage, setCurrentPage] = useQueryState("page", parseAsInteger.withDefault(1));
	const [itemsPerPage, setItemsPerPage] = useQueryState(
		"limit",
		parseAsStringLiteral([...INVITATION_PER_PAGE_OPTIONS]).withDefault("10"),
	);

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const isLoading = useLiveQuery(() => InvitationRepository.getAll().then(() => false), [], true);

	const sortedInvitations = useMemo(() => {
		const sorted = [...invitations];
		sorted.sort((a, b) => {
			if (sortOption === "status") {
				const aActive = !a.expiresAt || a.expiresAt > Date.now() ? 1 : 0;
				const bActive = !b.expiresAt || b.expiresAt > Date.now() ? 1 : 0;
				if (aActive !== bActive) return bActive - aActive; // Active first
				return b.createdAt - a.createdAt; // Then newest
			}
			if (sortOption === "date-asc") {
				return a.createdAt - b.createdAt;
			}
			// Default to date-desc
			return b.createdAt - a.createdAt;
		});
		return sorted;
	}, [invitations, sortOption]);

	const totalPages =
		itemsPerPage === "all"
			? 1
			: Math.max(1, Math.ceil(sortedInvitations.length / parseInt(itemsPerPage, 10)));
	const clampedPage = Math.max(1, Math.min(currentPage, totalPages));

	let paginatedInvitations = sortedInvitations;
	if (itemsPerPage !== "all") {
		const size = parseInt(itemsPerPage, 10);
		const startIndex = (clampedPage - 1) * size;
		paginatedInvitations = sortedInvitations.slice(startIndex, startIndex + size);
	}

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

	const handleSelectChange = (id: string, checked: boolean) => {
		const newSet = new Set(selectedIds);
		if (checked) {
			newSet.add(id);
		} else {
			newSet.delete(id);
		}
		setSelectedIds(newSet);
	};

	return {
		invitations,
		sortedInvitations,
		paginatedInvitations,
		sortOption,
		setSortOption,
		selectedIds,
		setSelectedIds,
		handleSelectChange,
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		totalPages,
		generatePageNumbers,
		clampedPage,
		isLoading,
	};
}
