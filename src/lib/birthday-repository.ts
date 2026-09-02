import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { Birthday } from "@/types/birthday";
import { db, type BirthdayRecord } from "./db";

export const BirthdayRepository = {
	async updateHasDataHint(): Promise<void> {
		const count = await db.birthdays.count();
		localStorage.setItem(STORAGE_KEYS.HAS_DATA, count > 0 ? "true" : "false");
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
		await db.transaction("rw", db.birthdays, db.notifications, async () => {
			const oldRecord = await db.birthdays.get(id);

			if (updates.birthday) {
				const recordUpdates = this.toRecordUpdates(updates);
				await db.birthdays.update(id, recordUpdates);
			} else {
				await db.birthdays.update(id, updates);
			}

			if (oldRecord) {
				if (updates.birthday && updates.birthday !== oldRecord.birthday) {
					// Birthday changed, delete all notifications so they get regenerated correctly for the new date
					await db.notifications.where("personId").equals(id).delete();
				} else if (updates.name && updates.name !== oldRecord.name) {
					// Name changed, update the text inside existing notifications
					const notifications = await db.notifications.where("personId").equals(id).toArray();
					for (const n of notifications) {
						const newMessage = n.message.replace(oldRecord.name, updates.name);
						await db.notifications.update(n.id, { message: newMessage });
					}
				}
			}
		});
		await this.updateHasDataHint();
	},

	async delete(id: string): Promise<void> {
		await db.transaction("rw", db.birthdays, db.notifications, async () => {
			await db.birthdays.delete(id);
			await db.notifications.where("personId").equals(id).delete();
		});
		await this.updateHasDataHint();
	},

	async deleteAll(): Promise<void> {
		await db.transaction("rw", db.birthdays, db.notifications, async () => {
			await db.birthdays.clear();
			await db.notifications.clear();
		});
		await this.updateHasDataHint();
	},

	async bulkDelete(ids: string[]): Promise<void> {
		await db.transaction("rw", db.birthdays, db.notifications, async () => {
			await db.birthdays.bulkDelete(ids);
			await db.notifications.where("personId").anyOf(ids).delete();
		});
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
