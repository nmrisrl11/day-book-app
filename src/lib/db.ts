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

export interface NotificationRecord {
	id: string;
	personId: string;
	type: "upcoming" | "today";
	message: string;
	read: boolean;
	cleared?: boolean;
	createdAt: number;
	date: string; // The "YYYY-MM-DD" date the notification is about
}

class DayBookDatabase extends Dexie {
	birthdays!: Table<BirthdayRecord, string>;
	invitations!: Table<InvitationRecord, string>;
	notifications!: Table<NotificationRecord, string>;

	constructor() {
		super("DayBookDatabase");

		this.version(1).stores({
			birthdays: "id, name, month, day, relationship",
		});

		this.version(2).stores({
			birthdays: "id, name, month, day, relationship",
			invitations: "id, createdAt, expiresAt, name",
		});

		this.version(3).stores({
			birthdays: "id, name, month, day, relationship",
			invitations: "id, createdAt, expiresAt, name",
			notifications: "id, personId, type, read, createdAt, date",
		});
	}
}

export const db = new DayBookDatabase();
