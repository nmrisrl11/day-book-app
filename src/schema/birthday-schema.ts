import { z } from "zod";

export const birthdaySchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, { message: "Name is required." })
		.min(2, { message: "Name must be at least 2 characters." })
		.max(50, { message: "Name must be less than 50 characters." })
		.regex(/^[\p{L}\s\-']+$/u, { message: "Name can only contain letters and spaces." }),
	birthday: z
		.string()
		.min(1, { message: "Birthday is required." })
		.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format." }),
	avatar: z.string().optional(),
});

export type BirthdayFormData = z.infer<typeof birthdaySchema>;
