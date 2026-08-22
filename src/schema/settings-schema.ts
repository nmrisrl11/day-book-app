import { z } from "zod";
import {
	GREETINGS_MAX_LENGTH,
	FLOATING_MESSAGE_MAX_LENGTH,
	CUSTOM_GREETING_MAX_LENGTH,
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

export const SettingsSchema = z
	.object({
		upcomingCount: z.number().int().min(1).max(10),
		theme: z.enum(["light", "dark"]),
		floatingMessages: z.array(z.string().max(FLOATING_MESSAGE_MAX_LENGTH)).optional(),
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
	})
	.strict();

type SettingsImport = z.infer<typeof SettingsSchema>;
