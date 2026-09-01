import { SEO } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { NotFoundScreen } from "@/features/not-found/not-found-screen";
import { useCurrentDate } from "@/hooks/use-current-date";
import { BirthdayRepository } from "@/lib/birthday-repository";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronLeftIcon } from "lucide-react";
import { Suspense, lazy, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PersonGiftsSection } from "./components/person-gifts-section";
import { PersonHeader } from "./components/person-header";
import { PersonNotesSection } from "./components/person-notes-section";
import { PersonSkeleton } from "./components/person-skeleton";

const BirthdayFormModal = lazy(() =>
	import("@/features/management/components/birthday-form-modal").then((m) => ({
		default: m.BirthdayFormModal,
	})),
);

const CalendarExportDialog = lazy(() =>
	import("@/features/calendar/components/calendar-export-dialog").then((m) => ({
		default: m.CalendarExportDialog,
	})),
);

export function PersonScreen() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const currentDate = useCurrentDate();

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isExportModalOpen, setIsExportModalOpen] = useState(false);

	// Using Dexie live query to stay in sync with IndexedDB
	const queryResult = useLiveQuery(async () => {
		if (!id) return { data: null };
		const data = await BirthdayRepository.getById(id);
		return { data: data || null };
	}, [id]);

	const isLoading = queryResult === undefined;
	const person = queryResult?.data;

	// Adding a small delay trick to prevent flashing the not found state while Dexie loads
	// useLiveQuery returns undefined initially, so we check isLoading.

	if (isLoading) {
		return <PersonSkeleton />;
	}

	if (!person) {
		return <NotFoundScreen />;
	}

	const handleBack = () => {
		navigate(-1); // Go back in history (likely to /manage with state)
	};

	return (
		<>
			<SEO title={`${person.name}'s Profile`} canonical={`/person/${person.id}`} robots="noindex" />
			<div className="flex w-full flex-col gap-6 pb-12">
				{/* Top Navigation */}
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:text-foreground -ml-2 h-9 px-2"
						onClick={handleBack}
					>
						<ChevronLeftIcon className="mr-1 h-4 w-4" />
						Back
					</Button>
				</div>

				<div className="mx-auto flex w-full max-w-3xl flex-col gap-6 md:gap-8">
					<PersonHeader
						person={person}
						currentDate={currentDate}
						onEdit={() => setIsEditModalOpen(true)}
						onExport={() => setIsExportModalOpen(true)}
					/>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<PersonGiftsSection person={person} onAddGift={() => setIsEditModalOpen(true)} />
						<PersonNotesSection person={person} onAddNote={() => setIsEditModalOpen(true)} />
					</div>
				</div>

				{/* Modals */}
				{isEditModalOpen && (
					<Suspense fallback={null}>
						<BirthdayFormModal
							open={isEditModalOpen}
							onOpenChange={setIsEditModalOpen}
							birthday={person}
						/>
					</Suspense>
				)}

				{isExportModalOpen && (
					<Suspense fallback={null}>
						<CalendarExportDialog
							open={isExportModalOpen}
							onOpenChange={setIsExportModalOpen}
							birthdays={person}
						/>
					</Suspense>
				)}
			</div>
		</>
	);
}
