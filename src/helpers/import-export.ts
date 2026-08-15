import type { Birthday } from "@/types/birthday";

export function exportBirthdays(birthdays: Birthday[]) {
	const dataStr = JSON.stringify(birthdays, null, 2);
	const blob = new Blob([dataStr], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `day-book-export-${new Date().toISOString().split("T")[0]}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function parseImportedBirthdays(fileText: string): Birthday[] {
	try {
		const parsed = JSON.parse(fileText);
		if (!Array.isArray(parsed)) {
			throw new Error("Imported data must be an array.");
		}

		// Basic schema validation
		const validBirthdays = parsed
			.filter((item) => {
				if (typeof item !== "object" || item === null) return false;
				if (typeof item.id !== "string" || !item.id) return false;
				if (typeof item.name !== "string" || !item.name) return false;
				if (typeof item.birthday !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(item.birthday))
					return false;
				if (item.avatar !== undefined) {
					if (typeof item.avatar !== "string") return false;
					if (
						!item.avatar.startsWith("data:image/jpeg;base64,") &&
						!item.avatar.startsWith("data:image/png;base64,")
					) {
						return false;
					}
					// Enforce 2MB limit (roughly 2.66MB in base64, size = length * 0.75)
					const sizeInBytes = item.avatar.length * 0.75;
					if (sizeInBytes > 2 * 1024 * 1024) return false;
				}
				return true;
			})
			.map((item: any) => ({
				id: item.id,
				name: item.name,
				birthday: item.birthday,
				avatar: item.avatar,
			})) as Birthday[];

		if (validBirthdays.length === 0 && parsed.length > 0) {
			throw new Error("No valid birthday records found in the imported file.");
		}

		return validBirthdays;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "Invalid JSON file.");
	}
}
