import { describe, expect, it } from "vitest";
import { SettingsSchema } from "../settings-schema";
import { FLOATING_MESSAGE_MAX_LENGTH } from "../validation-constants";

describe("SettingsSchema validation", () => {
	it("should accept valid minimal settings", () => {
		const result = SettingsSchema.safeParse({
			upcomingCount: 3,
			theme: "light",
		});
		expect(result.success).toBe(true);
	});

	it("should reject upcomingCount out of bounds", () => {
		const resultMin = SettingsSchema.safeParse({ upcomingCount: 0, theme: "light" });
		expect(resultMin.success).toBe(false);

		const resultMax = SettingsSchema.safeParse({ upcomingCount: 11, theme: "light" });
		expect(resultMax.success).toBe(false);
	});

	it("should reject invalid theme", () => {
		const result = SettingsSchema.safeParse({ upcomingCount: 3, theme: "blue" });
		expect(result.success).toBe(false);
	});

	it("should enforce onboarding step limits when in_progress", () => {
		const validProgress = SettingsSchema.safeParse({
			upcomingCount: 3,
			theme: "light",
			onboardingStatus: "in_progress",
			onboardingStep: 3,
		});
		expect(validProgress.success).toBe(true);

		const validUpperBoundary = SettingsSchema.safeParse({
			upcomingCount: 3,
			theme: "light",
			onboardingStatus: "in_progress",
			onboardingStep: 7,
		});
		expect(validUpperBoundary.success).toBe(true);

		const invalidProgress = SettingsSchema.safeParse({
			upcomingCount: 3,
			theme: "light",
			onboardingStatus: "in_progress",
			onboardingStep: 8,
		});
		expect(invalidProgress.success).toBe(false);
		if (!invalidProgress.success) {
			expect(invalidProgress.error.issues[0].message).toContain(
				"onboardingStep must be between 0 and 7",
			);
		}
	});

	it("should enforce string length limits on arrays", () => {
		const result = SettingsSchema.safeParse({
			upcomingCount: 3,
			theme: "light",
			floatingMessages: ["A".repeat(FLOATING_MESSAGE_MAX_LENGTH + 1)],
		});
		expect(result.success).toBe(false);
	});

	it("should enforce strict object validation (no extra keys)", () => {
		const result = SettingsSchema.safeParse({
			upcomingCount: 3,
			theme: "light",
			extraUnknownKey: "should fail",
		});
		expect(result.success).toBe(false);

		const nestedResult = SettingsSchema.safeParse({
			upcomingCount: 3,
			theme: "light",
			avatarSettings: {
				allowCustomUploads: true,
				defaultLibrary: "avvvatars",
				avvvatarsStyle: "character",
				boringAvatarsVariant: "marble",
				boringAvatarsColors: ["#fff"],
				extraKey: "should fail",
			},
		});
		expect(nestedResult.success).toBe(false);
	});
});
