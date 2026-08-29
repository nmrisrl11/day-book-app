import { BirthdayRepository } from "@/lib/birthday-repository";
import { type Birthday } from "@/types/birthday";
import { gooeyToast } from "goey-toast";
import { useState } from "react";

interface UseModalManagerProps {
	selectedIds: Set<string>;
	setSelectedIds: (ids: Set<string>) => void;
}

export function useModalManager({ selectedIds, setSelectedIds }: UseModalManagerProps) {
	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deletingBirthday, setDeletingBirthday] = useState<Birthday | null>(null);
	const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

	const [exportModalOpen, setExportModalOpen] = useState(false);
	const [exportingBirthday, setExportingBirthday] = useState<Birthday | null>(null);

	const [askModalOpen, setAskModalOpen] = useState(false);

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

	const handleExport = (birthday: Birthday) => {
		setExportingBirthday(birthday);
		setExportModalOpen(true);
	};

	const handleBulkDelete = () => {
		setBulkDeleteModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (deletingBirthday) {
			await BirthdayRepository.delete(deletingBirthday.id);
			gooeyToast.success("Birthday deleted", { showTimestamp: false });
			setDeleteModalOpen(false);
			setDeletingBirthday(null);
		}
	};

	const executeBulkDelete = async () => {
		try {
			await BirthdayRepository.bulkDelete(Array.from(selectedIds));
			const count = selectedIds.size;
			setSelectedIds(new Set());
			setBulkDeleteModalOpen(false);
			gooeyToast.success(`${count} ${count === 1 ? "birthday" : "birthdays"} deleted`, {
				showTimestamp: false,
			});
		} catch {
			gooeyToast.error("Failed to delete selected birthdays");
		}
	};

	return {
		formModalOpen,
		setFormModalOpen,
		editingBirthday,
		deleteModalOpen,
		setDeleteModalOpen,
		deletingBirthday,
		bulkDeleteModalOpen,
		setBulkDeleteModalOpen,
		exportModalOpen,
		setExportModalOpen,
		exportingBirthday,
		askModalOpen,
		setAskModalOpen,
		handleAdd,
		handleEdit,
		handleDeleteClick,
		handleExport,
		handleBulkDelete,
		handleConfirmDelete,
		executeBulkDelete,
	};
}
