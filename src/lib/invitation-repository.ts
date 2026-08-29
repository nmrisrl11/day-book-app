import { setHasInvitationsHint } from "@/helpers/storage";
import { db, type InvitationRecord } from "./db";

export const InvitationRepository = {
	async getAll(): Promise<InvitationRecord[]> {
		return await db.invitations.toArray();
	},

	async add(invitation: InvitationRecord): Promise<void> {
		await db.invitations.add(invitation);
		setHasInvitationsHint(true);
	},

	async bulkAdd(invitations: InvitationRecord[]): Promise<void> {
		await db.invitations.bulkPut(invitations);
		setHasInvitationsHint(true);
	},

	async delete(id: string): Promise<void> {
		await db.invitations.delete(id);
		const count = await db.invitations.count();
		if (count === 0) setHasInvitationsHint(false);
	},

	async bulkDelete(ids: string[]): Promise<void> {
		await db.invitations.bulkDelete(ids);
		const count = await db.invitations.count();
		if (count === 0) setHasInvitationsHint(false);
	},

	async deleteAll(): Promise<void> {
		await db.invitations.clear();
		setHasInvitationsHint(false);
	},
};
