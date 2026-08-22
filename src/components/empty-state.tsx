import { parseImportedBirthdays } from "@/helpers/import-export";
import { BirthdayRepository } from "@/lib/birthday-repository";
import { PlusIcon, UploadIcon } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { APP_INFO } from "@/constants/app-info";
import { Button } from "./ui/button";

const BirthdayFormModal = lazy(() =>
	import("../features/management/components/birthday-form-modal").then((m) => ({
		default: m.BirthdayFormModal,
	})),
);

export function EmptyState() {
	const [formModalOpen, setFormModalOpen] = useState(false);

	const handleImportClick = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json,application/json";
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;
			try {
				const text = await file.text();
				const importedBirthdays = parseImportedBirthdays(text);
				await BirthdayRepository.bulkSave(importedBirthdays);
			} catch (err) {
				alert(err instanceof Error ? err.message : "Failed to import data.");
			}
		};
		input.click();
	};

	return (
		<div className="flex w-full flex-col items-center justify-center pt-24 pb-32">
			{/* Decorative background elements */}
			<div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[24px_24px]" />

			<div className="mb-6 animate-bounce text-6xl">🎂</div>

			<h1 className="mb-4 text-center text-4xl font-extrabold tracking-tight md:text-5xl">
				Welcome to {APP_INFO.name}
			</h1>

			<p className="text-muted-foreground mb-8 max-w-md text-center text-lg">
				Your personal space to track family and friends' birthdays so you never miss a special day
				again.
			</p>

			<div className="flex w-full flex-col gap-4 px-4 sm:w-auto sm:flex-row">
				<Button
					size="lg"
					className="w-full text-base sm:w-auto"
					onClick={() => setFormModalOpen(true)}
				>
					<PlusIcon className="mr-2 h-5 w-5" />
					Add Your First Birthday
				</Button>

				<Button
					size="lg"
					variant="outline"
					className="w-full text-base sm:w-auto"
					onClick={handleImportClick}
				>
					<UploadIcon className="mr-2 h-5 w-5" />
					Import Data
				</Button>
			</div>

			{formModalOpen && (
				<Suspense fallback={null}>
					<BirthdayFormModal open={formModalOpen} onOpenChange={setFormModalOpen} birthday={null} />
				</Suspense>
			)}
		</div>
	);
}
