import type { GreetingTextSettings } from "@/types/settings";

export const MAIN_GREETINGS: string[] = [
	"Happy Birthday!",
	"It's Your Special Day!",
	"Let's Celebrate!",
	"Have a Wonderful Day!",
	"Wishing You the Best!",
];

export const DEFAULT_MAIN_GREETING = MAIN_GREETINGS[0];

export const DEFAULT_GREETING_TEXT_SETTINGS: GreetingTextSettings = {
	text: DEFAULT_MAIN_GREETING,
	type: "gradient",
	solidColor: "#ec4899", // pink-500
	gradient: {
		start: "#ec4899", // pink-500
		end: "#f97316", // orange-500
		direction: "to bottom right", // matching Tailwind's bg-gradient-to-br
	},
};
