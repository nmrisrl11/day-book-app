import { z } from "zod";
import {
	CUSTOM_GREETING_MAX_LENGTH,
	FLOATING_MESSAGE_MAX_LENGTH,
	GREETINGS_MAX_LENGTH,
} from "./validation-constants";

const AvatarLibrarySchema = z.enum(["avvvatars", "boring-avatars"]);
const AvvvatarsStyleSchema = z.enum(["character", "shape"]);
const BoringAvatarsVariantSchema = z.enum(["marble", "beam", "pixel", "sunset", "ring", "bauhaus"]);
const SoundNameSchema = z.enum([
	"chime",
	"sparkle",
	"droplet",
	"bloom",
	"whisper",
	"tick",
	"press",
	"release",
	"toggle",
	"success",
	"error",
	"page",
	"loading",
	"ready",
	"pulse",
	"scan",
	"arrival",
]);
const GreetingTextColorTypeSchema = z.enum(["solid", "gradient"]);
const OnboardingStatusSchema = z.enum(["not_started", "in_progress", "completed", "dismissed"]);
const QuickActionsPositionSchema = z.enum(["top-left", "top-right", "bottom-left", "bottom-right"]);

export const SettingsSchema = z
	.object({
		upcomingCount: z.number().int().min(1).max(10),
		theme: z.enum(["light", "dark"]),
		floatingMessages: z.array(z.string().max(FLOATING_MESSAGE_MAX_LENGTH)).optional(),
		customGreetingsEnabled: z.boolean().optional(),
		greetings: z.array(z.string().max(GREETINGS_MAX_LENGTH)).optional(),
		avatarSettings: z
			.object({
				allowCustomUploads: z.boolean(),
				defaultLibrary: AvatarLibrarySchema,
				avvvatarsStyle: AvvvatarsStyleSchema,
				boringAvatarsVariant: BoringAvatarsVariantSchema,
				boringAvatarsColors: z.array(z.string()),
			})
			.strict()
			.optional(),
		soundSettings: z
			.object({
				enabled: z.boolean(),
				volume: z.number().min(0).max(1),
				mappings: z
					.object({
						hover: SoundNameSchema,
						press: SoundNameSchema,
						toggle: SoundNameSchema,
						success: SoundNameSchema,
						error: SoundNameSchema,
					})
					.strict(),
			})
			.strict()
			.optional(),
		animationsEnabled: z.boolean().optional(),
		greetingTextSettings: z
			.object({
				text: z.string().max(CUSTOM_GREETING_MAX_LENGTH),
				fontFamily: z.string().optional(),
				type: GreetingTextColorTypeSchema,
				solidColor: z.string(),
				gradient: z
					.object({
						start: z.string(),
						end: z.string(),
						direction: z.string(),
					})
					.strict(),
			})
			.strict()
			.optional(),
		onboardingStatus: OnboardingStatusSchema.optional(),
		onboardingStep: z.number().int().min(0).optional(),
		quickActionsEnabled: z.boolean().optional(),
		quickActionsPosition: QuickActionsPositionSchema.optional(),
		quickActionsIsOpen: z.boolean().optional(),
		lastBackupDate: z.string().optional(),
		lastBackupReminderDismissedAt: z.string().optional(),
		lastInstallPromptDismissedAt: z.string().optional(),
		notificationSettings: z
			.object({
				enabled: z.boolean(),
				remindDaysBefore: z.array(z.number()),
			})
			.strict()
			.optional(),
	})
	.strict()
	.superRefine((data, ctx) => {
		if (data.onboardingStatus === "in_progress") {
			if (
				data.onboardingStep !== undefined &&
				(data.onboardingStep < 0 || data.onboardingStep > 7)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "onboardingStep must be between 0 and 7 when in_progress",
					path: ["onboardingStep"],
				});
			}
		}
	});
