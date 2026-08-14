import { useState } from "react";
import { useDayBook } from "@/context/day-book-context";
import { BirthdayListItem } from "./birthday-list-item";
import { BirthdayFormModal } from "./birthday-form-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import type { Birthday } from "@/types/birthday";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function BirthdayManagementScreen() {
	const { birthdays, deleteBirthday } = useDayBook();

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deletingBirthday, setDeletingBirthday] = useState<Birthday | null>(null);

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
				<div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-2">
					{birthdays.map((birthday) => (
						<BirthdayListItem
							key={birthday.id}
							birthday={birthday}
							onEdit={() => handleEdit(birthday)}
							onDelete={() => handleDeleteClick(birthday)}
						/>
					))}
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
