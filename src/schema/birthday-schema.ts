import { z } from "zod";
import {
	NAME_MAX_LENGTH,
	NAME_MIN_LENGTH,
	NOTE_MAX_COUNT,
	NOTE_MAX_LENGTH,
} from "./validation-constants";

export const birthdaySchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, { message: "Name is required." })
		.min(NAME_MIN_LENGTH, { message: `Name must be at least ${NAME_MIN_LENGTH} characters.` })
		.max(NAME_MAX_LENGTH, { message: `Name must be less than ${NAME_MAX_LENGTH} characters.` })
		.regex(/^[\p{L}\p{N}\p{M} \-']+$/u, {
			message: "Name can only contain letters, numbers, spaces, hyphens, and apostrophes.",
		}),
	birthday: z
		.string()
		.min(1, { message: "Birthday is required." })
		.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format." })
		.superRefine((dateStr, ctx) => {
			const [year, month, day] = dateStr.split("-").map(Number);
			const date = new Date(year, month - 1, day);

			if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Invalid date.",
				});
				return;
			}

			if (year < 1900) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Year must be 1900 or later.",
				});
				return;
			}

			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (date > today) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Birthday cannot be in the future.",
				});
			}
		}),
	avatar: z.string().optional(),
	relationship: z.string().min(1, { message: "Relationship is required." }),
	notes: z
		.array(
			z
				.string()
				.trim()
				.min(1, { message: "Note cannot be empty." })
				.max(NOTE_MAX_LENGTH, { message: `Note must be ${NOTE_MAX_LENGTH} characters or less.` }),
		)
		.max(NOTE_MAX_COUNT, { message: `You can only add up to ${NOTE_MAX_COUNT} notes.` }),
});

export type BirthdayFormData = z.infer<typeof birthdaySchema>;

export const inviteeSchema = birthdaySchema.pick({ name: true, birthday: true });
export type InviteeFormData = z.infer<typeof inviteeSchema>;
