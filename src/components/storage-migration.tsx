import { useEffect, useRef, useState } from "react";
import { BirthdayRepository } from "@/lib/birthday-repository";
import type { Birthday } from "@/types/birthday";
import { Loader2 } from "lucide-react";

export function StorageMigration({ onComplete }: { onComplete: () => void }) {
	const hasRun = useRef(false);
	const [isMigrating, setIsMigrating] = useState(false);

	useEffect(() => {
		if (hasRun.current) return;
		hasRun.current = true;

		const performMigration = async () => {
			try {
				const marker = localStorage.getItem("daybook:birthday-storage:migrated");
				if (marker === "true") {
					onComplete();
					return;
				}

				let legacyBirthdays: Birthday[] = [];

				const zustandData = localStorage.getItem("daybook-storage");
				if (zustandData) {
					try {
						const parsed = JSON.parse(zustandData);
						if (parsed.state && Array.isArray(parsed.state.birthdays)) {
							legacyBirthdays = parsed.state.birthdays;
						}
					} catch (e) {
						console.error("Failed to parse daybook-storage", e);
					}
				}

				if (legacyBirthdays.length === 0) {
					const oldData = localStorage.getItem("daybook_birthdays");
					if (oldData) {
						try {
							const parsed = JSON.parse(oldData);
							if (Array.isArray(parsed)) {
								legacyBirthdays = parsed;
							}
						} catch (e) {
							console.error("Failed to parse daybook_birthdays", e);
						}
					}
				}

				if (legacyBirthdays.length > 0) {
					setIsMigrating(true);

					const mappedBirthdays = legacyBirthdays.map((b) => ({
						...b,
						relationship: b.relationship || "Other",
						notes: Array.isArray(b.notes) ? b.notes : [],
					}));

					await BirthdayRepository.bulkSave(mappedBirthdays);
					console.log(`Migrated ${mappedBirthdays.length} birthdays to IndexedDB.`);
				}

				localStorage.setItem("daybook:birthday-storage:migrated", "true");
				onComplete();
			} catch (error) {
				console.error("Error during migration to IndexedDB:", error);
				// If error happens, we still complete so app isn't blocked forever,
				// but we don't set the migrated flag so it can retry later.
				onComplete();
			}
		};

		performMigration();
	}, [onComplete]);

	if (isMigrating) {
		return (
			<div className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center">
				<Loader2 className="text-primary mb-4 h-12 w-12 animate-spin" />
				<h2 className="text-xl font-medium tracking-tight">Updating database...</h2>
				<p className="text-muted-foreground mt-2 text-sm">
					Please wait while we migrate your data to the new storage system.
				</p>
			</div>
		);
	}

	return null;
}
