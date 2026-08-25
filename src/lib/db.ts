import type { Birthday } from "@/types/birthday";
import Dexie, { type Table } from "dexie";

export interface BirthdayRecord extends Birthday {
	month: number;
	day: number;
}

export interface InvitationRecord {
	id: string;
	token: string;
	name: string;
	createdAt: number;
	expiresAt: number | null;
}

class DayBookDatabase extends Dexie {
	birthdays!: Table<BirthdayRecord, string>;
	invitations!: Table<InvitationRecord, string>;

	constructor() {
		super("DayBookDatabase");

		this.version(1).stores({
			birthdays: "id, name, month, day, relationship",
		});

		this.version(2).stores({
			birthdays: "id, name, month, day, relationship",
			invitations: "id, createdAt, expiresAt, name",
		});
	}
}

export const db = new DayBookDatabase();
