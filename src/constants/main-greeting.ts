import type { GreetingTextSettings } from "@/types/settings";

export const MAIN_GREETINGS: string[] = [
	"Happy Birthday!",
	"It's Your Special Day!",
	"Let's Celebrate!",
	"Have a Wonderful Day!",
	"Wishing You the Best!",
];

export const MAIN_GREETING_FONTS = [
	{ label: "Default", value: "" },
	{ label: "Balsamiq Sans", value: "'Balsamiq Sans', cursive" },
	{ label: "Caveat", value: "'Caveat', cursive" },
	{ label: "Chewy", value: "'Chewy', system-ui" },
	{ label: "Fredoka", value: "'Fredoka', sans-serif" },
	{ label: "Pacifico", value: "'Pacifico', cursive" },
];

export const GREETING_TEXT_SETTINGS: GreetingTextSettings = {
	text: MAIN_GREETINGS[0],
	fontFamily: MAIN_GREETING_FONTS[0].value,
	type: "gradient",
	solidColor: "#ec4899",
	gradient: {
		start: "#ec4899",
		end: "#f97316",
		direction: "to bottom right",
	},
};
