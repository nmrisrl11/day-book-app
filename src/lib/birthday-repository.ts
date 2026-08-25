import type { Birthday } from "@/types/birthday";
import { db, type BirthdayRecord } from "./db";

export const BirthdayRepository = {
	async updateHasDataHint(): Promise<void> {
		const count = await db.birthdays.count();
		localStorage.setItem("daybook_has_data", count > 0 ? "true" : "false");
	},

	async getAll(): Promise<Birthday[]> {
		return await db.birthdays.toArray();
	},

	async getById(id: string): Promise<Birthday | undefined> {
		return await db.birthdays.get(id);
	},

	async count(): Promise<number> {
		return await db.birthdays.count();
	},

	async save(birthday: Birthday): Promise<void> {
		const record = this.toRecord(birthday);
		await db.birthdays.put(record);
		await this.updateHasDataHint();
	},

	async update(id: string, updates: Partial<Birthday>): Promise<void> {
		if (updates.birthday) {
			const recordUpdates = this.toRecordUpdates(updates);
			await db.birthdays.update(id, recordUpdates);
		} else {
			await db.birthdays.update(id, updates);
		}
		await this.updateHasDataHint();
	},

	async delete(id: string): Promise<void> {
		await db.birthdays.delete(id);
		await this.updateHasDataHint();
	},

	async deleteAll(): Promise<void> {
		await db.birthdays.clear();
		await this.updateHasDataHint();
	},

	async bulkDelete(ids: string[]): Promise<void> {
		await db.birthdays.bulkDelete(ids);
		await this.updateHasDataHint();
	},

	async bulkSave(birthdays: Birthday[]): Promise<void> {
		const records = birthdays.map((b) => this.toRecord(b));
		await db.birthdays.bulkPut(records);
		await this.updateHasDataHint();
	},

	toRecord(birthday: Birthday): BirthdayRecord {
		const [, monthStr, dayStr] = birthday.birthday.split("-");
		return {
			...birthday,
			month: parseInt(monthStr, 10),
			day: parseInt(dayStr, 10),
		};
	},

	toRecordUpdates(updates: Partial<Birthday>): Partial<BirthdayRecord> {
		const recordUpdates: Partial<BirthdayRecord> = { ...updates };
		if (updates.birthday) {
			const [, monthStr, dayStr] = updates.birthday.split("-");
			recordUpdates.month = parseInt(monthStr, 10);
			recordUpdates.day = parseInt(dayStr, 10);
		}
		return recordUpdates;
	},
};
