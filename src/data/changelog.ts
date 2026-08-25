type ChangelogCategory = "added" | "improved" | "fixed" | "changed" | "removed";

interface ChangelogItem {
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
		version: "1.2.0",
		date: "2026-08-25",
		title: "Invitation Links & Data Management Redesign",
		summary:
			"Introducing Generated Links Management to easily view and share previously created invitations, alongside a vastly improved Data Management experience and new touch accessibility improvements.",
		changes: [
			{
				type: "added",
				title: "Generated Links Management",
				description:
					"Added a brand new tab to view, copy, share, and delete previously generated birthday invitation links. Links now support variable expirations (24 hours, 7 days, or never), sync perfectly between devices, and can be backed up manually.",
			},
			{
				type: "improved",
				title: "Data Management Redesign",
				description:
					"Completely redesigned the Data Management settings tab to consolidate all backup, restore, and sync features into a cleaner, more compact list layout.",
			},
			{
				type: "improved",
				title: "Safer Danger Zone",
				description:
					"Separated the 'Delete All Data' action into distinct 'Delete All Birthdays' and 'Delete All Invitations' buttons, ensuring you have granular control and don't accidentally wipe data you want to keep.",
			},
			{
				type: "improved",
				title: "Mobile Accessibility",
				description:
					"Expanded touch targets across navigation buttons and footer links to make the app much easier to use on mobile devices and prevent frustrating mis-taps.",
			},
			{
				type: "fixed",
				title: "Under the Hood Polish",
				description:
					"Fixed a rare edge case with legacy invitation tokens, improved screen reader accessibility for management buttons, and patched a potential layout stretch issue with long links.",
			},
		],
	},
	{
		version: "1.1.0",
		date: "2026-08-24",
		title: "Device Sync & Quick Actions",
		summary:
			"Instantly and securely sync your entire database directly between your devices over the local network, and customize your dashboard with the new Quick Action Toolbar.",
		changes: [
			{
				type: "added",
				title: "Device Sync",
				description:
					"Securely sync your entire DayBook database directly between your devices over your local network using a 6-character connection code. No cloud storage or complicated file transfers required.",
			},
			{
				type: "added",
				title: "Quick Action Toolbar",
				description:
					"Instantly customize how your avatars and greetings look with the new draggable, edge-dockable Quick Action Toolbar right on your dashboard.",
			},
			{
				type: "added",
				title: "Animated Invite Icons",
				description:
					"Added beautiful, custom animated icons for the invitation feature to make requesting and receiving birthdays even more delightful.",
			},
			{
				type: "improved",
				title: "Data Management Redesign",
				description:
					"Completely redesigned the Data Management settings with a cleaner, card-based layout to make managing your backups and syncs easier than ever.",
			},
			{
				type: "fixed",
				title: "Under the Hood",
				description:
					"Fixed timezone bugs affecting birthday selection, added strict calendar validation, improved overall app accessibility, and enhanced the security and transparency of our new sync feature.",
			},
		],
	},
	{
		version: "1.0.0",
		date: "2026-08-23",
		title: "Interactive Tours & App Installation",
		summary:
			"Introducing a seamless first-time user tutorial, dedicated app installation support, and numerous UI polish updates across the board.",
		changes: [
			{
				type: "added",
				title: "Interactive Application Tours",
				description:
					"Added a beautifully designed, route-aware interactive tutorial to guide you through the app's core features, plus an on-demand educational tour to demystify JSON and .ics files in Settings.",
			},
			{
				type: "added",
				title: "Install Anywhere",
				description:
					"Introduced a dedicated /install screen to help you seamlessly install DayBook as an app on your phone, tablet, or desktop, complete with specific instructions for iOS users.",
			},
			{
				type: "improved",
				title: "Playful Micro-interactions",
				description:
					"The DayBook logo now features a delightful jelly bounce and sound effect when clicked. We also upgraded our floating notifications with a smoother, gooey design.",
			},
			{
				type: "fixed",
				title: "Stability & Polish",
				description:
					"Eliminated jarring layout shifts during initial load, patched memory leaks during file imports, and improved the layout for sharing long invitation links.",
			},
		],
	},
	{
		version: "0.9.0",
		date: "2026-08-22",
		title: "Performance, Privacy & Polish",
		summary:
			"A massive under-the-hood upgrade bringing lightning-fast performance, unlimited storage, and beautiful new interactions.",
		changes: [
			{
				type: "added",
				title: "Powerful Data Management",
				description:
					"We've completely overhauled how your data is stored. Our new storage architecture is blazing fast, handles thousands of birthdays without breaking a sweat, and gives you exact insights into your storage usage. You can even enable Persistent Storage to prevent your browser from ever accidentally clearing your data!",
			},
			{
				type: "improved",
				title: "The Import Experience",
				description:
					"Importing from a JSON backup now features a beautiful preview! You can review duplicates, see exactly what's being imported, and hand-select specific birthdays before they are added.",
			},
			{
				type: "improved",
				title: "Delightful Details",
				description:
					"We sprinkled magic all over the app! You'll notice smooth, gooey animations on notifications, seamless scrolling, a sleek new Data Management layout, and a helpful indicator showing exactly how many days are left until an upcoming birthday.",
			},
			{
				type: "added",
				title: "Bulletproof Offline Mode",
				description:
					"Your experience stays perfect even when the internet drops. The app now instantly notifies you of connection changes, caches all beautiful fonts for offline use, and provides tailored, easy-to-follow instructions for installing the app directly to your iPhone or iPad home screen.",
			},
		],
	},
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
