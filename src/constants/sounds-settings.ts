import type { SoundName, SoundSettings } from "@/types/settings";

export const SOUND_COLORS: Record<SoundName, string> = {
	chime: "bg-blue-500",
	sparkle: "bg-yellow-400",
	droplet: "bg-cyan-500",
	bloom: "bg-pink-500",
	whisper: "bg-gray-400",
	tick: "bg-zinc-500",
	press: "bg-stone-600",
	release: "bg-stone-400",
	toggle: "bg-orange-500",
	success: "bg-green-500",
	error: "bg-red-500",
	page: "bg-purple-500",
	loading: "bg-blue-400",
	ready: "bg-emerald-500",
	pulse: "bg-indigo-500",
	scan: "bg-violet-500",
	arrival: "bg-fuchsia-500",
};

export const INTERACTION_TYPES = [
	{ id: "hover", label: "Navigation Hover" },
	{ id: "press", label: "Primary Click/Press" },
	{ id: "toggle", label: "Toggle/Switch" },
	{ id: "success", label: "Success Notification" },
	{ id: "error", label: "Error/Warning" },
] as const;

export const SOUND_SETTINGS: SoundSettings = {
	enabled: true,
	volume: 0.5,
	mappings: {
		hover: "tick",
		press: "pulse",
		toggle: "toggle",
		success: "success",
		error: "error",
	},
};
