import type { Birthday } from "@/types/birthday";

/**
 * Clean up common calendar birthday suffixes and emojis
 */
function cleanBirthdaySummary(summary: string): string {
	let name = summary;

	// Remove common emojis
	name = name.replace(/[🎂🎁🎉🎊🎈]/gu, "");

	// Remove common prefixes/suffixes
	const patterns = [/'s Birthday/i, / Birthday/i, /Birthday - /i, /Birthday: /i, / turns \d+/i];

	for (const pattern of patterns) {
		name = name.replace(pattern, "");
	}

	return name.trim();
}

/**
 * Parses YYYYMMDD into YYYY-MM-DD
 */
function parseIcsDateString(dateStr: string): string | null {
	// e.g. 20260314 or 20260314T120000Z
	const match = dateStr.match(/^(\d{4})(\d{2})(\d{2})/);
	if (match) {
		const year = Number(match[1]);
		const month = Number(match[2]);
		const day = Number(match[3]);

		const date = new Date(Date.UTC(year, month - 1, day));
		if (
			date.getUTCFullYear() === year &&
			date.getUTCMonth() === month - 1 &&
			date.getUTCDate() === day
		) {
			return `${match[1]}-${match[2]}-${match[3]}`;
		}
	}
	return null;
}

/**
 * Simple ICS parser to extract birthday events.
 * It unfolds lines, splits by VEVENT blocks, and looks for yearly recurrence or 'birthday' in the title.
 */
export function parseIcsForBirthdays(icsText: string): Birthday[] {
	// Unfold lines: an ICS line starting with space/tab is a continuation of the previous line
	const unfolded = icsText.replace(/\r?\n[ \t]/g, "");
	const lines = unfolded.split(/\r?\n/);

	const unescapeIcsText = (text: string) => {
		return text.replace(/\\([n,;\\])/gi, (_match, p1) => {
			if (p1.toLowerCase() === "n") return "\n";
			return p1;
		});
	};

	const birthdays: Birthday[] = [];

	let insideEvent = false;
	let currentSummary = "";
	let currentDtStart = "";
	let currentRrule = "";
	let currentDescription = "";
	let currentNotes: string[] = [];

	for (const line of lines) {
		if (line.startsWith("BEGIN:VEVENT")) {
			insideEvent = true;
			currentSummary = "";
			currentDtStart = "";
			currentRrule = "";
			currentDescription = "";
			currentNotes = [];
			continue;
		}

		if (line.startsWith("END:VEVENT")) {
			insideEvent = false;

			// Process the event we just finished parsing
			const isYearly = currentRrule.includes("FREQ=YEARLY");
			const hasBirthdayInTitle = currentSummary.toLowerCase().includes("birthday");

			// We consider it a birthday if it's explicitly a yearly event, OR if the title has 'birthday' in it
			if (currentSummary && currentDtStart && (isYearly || hasBirthdayInTitle)) {
				const dateString = parseIcsDateString(currentDtStart);
				if (dateString) {
					let relationship: Birthday["relationship"] = "Other";
					let notes: string[] = [];

					if (currentDescription) {
						const relMatch = currentDescription.match(/Relationship:\s*(.+?)(?:\n|$)/i);
						if (relMatch) {
							relationship = relMatch[1].trim();
						}
					}

					if (currentNotes.length > 0) {
						notes = [...currentNotes];
					}

					birthdays.push({
						id: crypto.randomUUID(),
						name: cleanBirthdaySummary(currentSummary),
						birthday: dateString,
						avatar: "",
						relationship,
						notes,
					});
				}
			}
			continue;
		}

		if (insideEvent) {
			if (line.startsWith("SUMMARY:")) {
				currentSummary = unescapeIcsText(line.substring(8)); // Length of 'SUMMARY:'
			} else if (line.startsWith("DESCRIPTION:")) {
				currentDescription = unescapeIcsText(line.substring(12));
			} else if (line.startsWith("DTSTART")) {
				// E.g., DTSTART;VALUE=DATE:20260314 or DTSTART:20260314T120000Z
				const parts = line.split(":");
				if (parts.length > 1) {
					currentDtStart = parts[1];
				}
			} else if (line.startsWith("RRULE:")) {
				currentRrule = line.substring(6);
			} else if (line.startsWith("X-DAYBOOK-NOTE:")) {
				currentNotes.push(unescapeIcsText(line.substring(15)));
			}
		}
	}

	return birthdays;
}
