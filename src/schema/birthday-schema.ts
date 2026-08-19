import { z } from "zod";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "./validation-constants";

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
		.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format." }),
	avatar: z.string().optional(),
});

export type BirthdayFormData = z.infer<typeof birthdaySchema>;
