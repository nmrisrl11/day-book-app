import { describe, it, expect, vi } from "vitest";
import { getRandomPalette } from "../color-palettes";
import palettes from "nice-color-palettes";

describe("color-palettes", () => {
	describe("getRandomPalette", () => {
		it("should return a random palette when no current palette is provided", () => {
			const palette = getRandomPalette();
			expect(palette).toBeDefined();
			expect(Array.isArray(palette)).toBe(true);
			expect(palettes).toContainEqual(palette);
		});

		it("should return a random palette when current palette string is invalid/not found", () => {
			const palette = getRandomPalette("invalid,color,string");
			expect(palette).toBeDefined();
			expect(Array.isArray(palette)).toBe(true);
			expect(palettes).toContainEqual(palette);
		});

		it("should return a different palette than the current one", () => {
			// Find a real palette string from the library to test
			const firstPalette = palettes[0];
			const firstPaletteStr = firstPalette.join(",");

			// Mock Math.random to always pick a specific offset for determinism (e.g., 0.5)
			vi.spyOn(Math, "random").mockReturnValue(0.5);

			const newPalette = getRandomPalette(firstPaletteStr);

			expect(newPalette.join(",")).not.toBe(firstPaletteStr);
			expect(palettes).toContainEqual(newPalette);

			vi.restoreAllMocks();
		});

		it("should handle partial palette strings (e.g. fewer colors than full array)", () => {
			// If a user only has 3 colors saved but the palette actually has 5
			const firstPalette = palettes[0];
			const partialStr = firstPalette.slice(0, 3).join(",");

			vi.spyOn(Math, "random").mockReturnValue(0.5);
			const newPalette = getRandomPalette(partialStr);

			expect(newPalette.join(",")).not.toBe(firstPalette.join(","));

			vi.restoreAllMocks();
		});
	});
});
