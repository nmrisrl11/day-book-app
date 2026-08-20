export type ChangelogCategory = "added" | "improved" | "fixed" | "changed" | "removed";

export interface ChangelogItem {
	type: ChangelogCategory;
	title: string;
	description: string;
}

export interface ChangelogRelease {
	version: string;
	date: string;
	title: string;
	summary?: string;
	changes: ChangelogItem[];
}

export const changelog: ChangelogRelease[] = [
	{
		version: "0.8.0",
		date: "2026-08-20",
		title: "Remember the people you love",
		summary:
			"A major evolution to focus not just on dates, but on the meaningful relationships and memories tied to them.",
		changes: [
			{
				type: "added",
				title: "About & History",
				description:
					"Added a dedicated about page so you can easily learn more about our privacy-first approach and see how the app has grown.",
			},
			{
				type: "added",
				title: "Relationship Details",
				description:
					"Birthdays are now personal profiles. You can label relationships (like Family, Friend, Partner) and jot down special notes or gift ideas.",
			},
			{
				type: "improved",
				title: "Visual Enhancements",
				description:
					"Polished up the look and feel across the board, making fonts crisper and adding smooth scrolling to the history section.",
			},
		],
	},
	{
		version: "0.7.0",
		date: "2026-08-18",
		title: "Links, Tracking & App Install",
		summary:
			"Introduced shareable links to easily collect birthdays from friends, alongside a seamless app installation experience.",
		changes: [
			{
				type: "added",
				title: "Shareable Links",
				description:
					"Ask friends and family for their birthday through a unique link. You can magically add their responses straight back into your app.",
			},
			{
				type: "added",
				title: "Usage Insights",
				description:
					"Added a completely private, anonymous way to see how many people are visiting, without ever tracking who you are.",
			},
			{
				type: "improved",
				title: "Install as an App",
				description:
					"You can now install the app directly to your phone or computer's home screen! It works beautifully even when you have no internet.",
			},
			{
				type: "improved",
				title: "Lightning Fast Loads",
				description:
					"Sprinkled some behind-the-scenes magic to make sure the app loads instantly, even on slower connections.",
			},
		],
	},
	{
		version: "0.5.0",
		date: "2026-08-16",
		title: "Your Data, Everywhere",
		summary:
			"Established our core commitment to privacy: your data stays on your device, but goes where you need it.",
		changes: [
			{
				type: "added",
				title: "Local-First Privacy",
				description:
					"Complete privacy and control over your data. We added easy buttons to backup or restore your birthdays anytime.",
			},
			{
				type: "added",
				title: "Calendar Sync",
				description:
					"Easily send birthdays directly to your Google Calendar, Apple Calendar, or Outlook.",
			},
			{
				type: "improved",
				title: "Bulletproof Data",
				description:
					"Added behind-the-scenes checks so whenever you import a backup, we make sure it's perfectly formatted and safe to use.",
			},
		],
	},
	{
		version: "0.4.0",
		date: "2026-08-15",
		title: "Customization & Greetings",
		summary:
			"Introduced rich customization options allowing you to personalize the look, feel, and sound of the experience.",
		changes: [
			{
				type: "added",
				title: "Make It Yours",
				description:
					"Personalize your dashboard with custom fonts, beautiful gradients, and unique color mixes.",
			},
			{
				type: "added",
				title: "Delightful Sounds",
				description:
					"We added soft, customizable sound effects to make clicking around the app feel more alive and fun.",
			},
			{
				type: "added",
				title: "Celebration Effects",
				description:
					"Watch celebratory messages float across your screen on special days. You have full control over how they animate!",
			},
		],
	},
	{
		version: "0.2.0",
		date: "2026-08-15",
		title: "Avatars & Instant Search",
		summary:
			"A massive upgrade to how you view and find your friends, making the list colorful and snappy.",
		changes: [
			{
				type: "added",
				title: "Beautiful Profiles",
				description:
					"Added fun default avatars and the ability to upload your own photos to easily recognize everyone.",
			},
			{
				type: "improved",
				title: "Snappy Experience",
				description:
					"Completely rebuilt the engine under the hood so the app feels instantly responsive, no matter how many birthdays you add.",
			},
			{
				type: "added",
				title: "Find Anyone Instantly",
				description:
					"Added a lightning-fast search bar and filters so you can easily find exactly who you're looking for.",
			},
		],
	},
	{
		version: "0.1.0",
		date: "2026-08-15",
		title: "The Beginning",
		summary:
			"The very first version! We set the groundwork for a simple, beautiful, and completely private birthday tracker.",
		changes: [
			{
				type: "added",
				title: "Initial Launch",
				description:
					"The basic foundation: a beautiful list, simple tracking, and a gorgeous Dark Mode.",
			},
			{
				type: "added",
				title: "Dashboard Views",
				description:
					"Introduced the clean upcoming birthdays list and a handy month-by-month view.",
			},
		],
	},
];
