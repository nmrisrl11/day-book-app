import { setHasInvitationsHint } from "@/helpers/storage";
import { db, type InvitationRecord } from "./db";

export class InvitationRepository {
	static async getAll(): Promise<InvitationRecord[]> {
		return await db.invitations.toArray();
	}

	static async add(invitation: InvitationRecord): Promise<void> {
		await db.invitations.add(invitation);
		setHasInvitationsHint(true);
	}

	static async bulkAdd(invitations: InvitationRecord[]): Promise<void> {
		await db.invitations.bulkPut(invitations);
		setHasInvitationsHint(true);
	}

	static async delete(id: string): Promise<void> {
		await db.invitations.delete(id);
		const count = await db.invitations.count();
		if (count === 0) setHasInvitationsHint(false);
	}

	static async bulkDelete(ids: string[]): Promise<void> {
		await db.invitations.bulkDelete(ids);
		const count = await db.invitations.count();
		if (count === 0) setHasInvitationsHint(false);
	}

	static async deleteAll(): Promise<void> {
		await db.invitations.clear();
		setHasInvitationsHint(false);
	}
}
