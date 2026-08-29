import { describe, expect, it } from "vitest";
import { useDayBookStore, defaultSettings, mergeState } from "../day-book-store";

describe("DayBook Store", () => {
	describe("Rehydration Flow", () => {
		it("should recover from primitive state.settings without throwing", () => {
			// Define a corrupted state where settings is a primitive string instead of an object
			const corruptedState = {
				settings: "this is not an object",
			};

			const currentState = useDayBookStore.getState();

			// If the guard is working, mergeState should gracefully fallback to default settings
			// and NOT throw an error when assigning mergedSettings.upcomingCount
			expect(() => {
				const result = mergeState(corruptedState, currentState);

				// Assert that the settings reverted to defaults and is definitely an object
				expect(result).toBeDefined();
				// @ts-ignore
				expect(result?.settings).toBeDefined();
				// @ts-ignore
				expect(typeof result?.settings).toBe("object");
				// @ts-ignore
				expect(result?.settings?.upcomingCount).toBe(defaultSettings.upcomingCount);
			}).not.toThrow();
		});
	});
});
