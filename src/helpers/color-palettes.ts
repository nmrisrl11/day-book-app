import palettes from "nice-color-palettes";

export function getRandomPalette(currentPaletteStr?: string): string[] {
	let randomPalette = palettes[Math.floor(Math.random() * palettes.length)];

	// Ensure it picks a different one if possible
	if (currentPaletteStr && randomPalette.join(",") === currentPaletteStr && palettes.length > 1) {
		randomPalette =
			palettes[(Math.floor(Math.random() * (palettes.length - 1)) + 1) % palettes.length];
	}

	return randomPalette;
}
