import Dexie, { type Table } from "dexie";
import type { Birthday } from "@/types/birthday";

export interface BirthdayRecord extends Birthday {
	month: number;
	day: number;
}

class DayBookDatabase extends Dexie {
	birthdays!: Table<BirthdayRecord, string>;

	constructor() {
		super("DayBookDatabase");

		this.version(1).stores({
			birthdays: "id, name, month, day, relationship",
		});
	}
}

export const db = new DayBookDatabase();
