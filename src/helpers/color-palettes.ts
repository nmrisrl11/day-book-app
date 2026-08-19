import palettes from "nice-color-palettes";

export function getRandomPalette(currentPaletteStr?: string): string[] {
	if (!currentPaletteStr || palettes.length <= 1) {
		return palettes[Math.floor(Math.random() * palettes.length)];
	}

	const colorsCount = currentPaletteStr.split(",").length;
	const currentIndex = palettes.findIndex(
		(p) => p.slice(0, colorsCount).join(",") === currentPaletteStr,
	);

	if (currentIndex === -1) {
		return palettes[Math.floor(Math.random() * palettes.length)];
	}

	// Pick a random index from the remaining palettes
	const offset = Math.floor(Math.random() * (palettes.length - 1)) + 1;
	const newIndex = (currentIndex + offset) % palettes.length;

	return palettes[newIndex];
}
