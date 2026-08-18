import type { Birthday } from "@/types/birthday";

/**
 * Clean up common calendar birthday suffixes and emojis
 */
function cleanBirthdaySummary(summary: string): string {
	let name = summary;

	// Remove common emojis
	name = name.replace(/[🎂🎁🎉🎊🎈]/g, "");

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

		const date = new Date(year, month - 1, day);
		if (
			date.getFullYear() === year &&
			date.getMonth() === month - 1 &&
			date.getDate() === day
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
		return text
			.replace(/\\n/gi, "\n")
			.replace(/\\,/g, ",")
			.replace(/\\;/g, ";")
			.replace(/\\\\/g, "\\");
	};

	const birthdays: Birthday[] = [];

	let insideEvent = false;
	let currentSummary = "";
	let currentDtStart = "";
	let currentRrule = "";

	for (const line of lines) {
		if (line.startsWith("BEGIN:VEVENT")) {
			insideEvent = true;
			currentSummary = "";
			currentDtStart = "";
			currentRrule = "";
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
					birthdays.push({
						id: crypto.randomUUID(),
						name: cleanBirthdaySummary(currentSummary),
						birthday: dateString,
						avatar: "",
					});
				}
			}
			continue;
		}

		if (insideEvent) {
			if (line.startsWith("SUMMARY:")) {
				currentSummary = unescapeIcsText(line.substring(8)); // Length of 'SUMMARY:'
			} else if (line.startsWith("DTSTART")) {
				// E.g., DTSTART;VALUE=DATE:20260314 or DTSTART:20260314T120000Z
				const parts = line.split(":");
				if (parts.length > 1) {
					currentDtStart = parts[1];
				}
			} else if (line.startsWith("RRULE:")) {
				currentRrule = line.substring(6);
			}
		}
	}

	return birthdays;
}
