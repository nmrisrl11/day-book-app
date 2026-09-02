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
		version: "1.9.0",
		date: "2026-09-02",
		title: "Instant Search & Push Notifications",
		summary:
			"We've added a lightning-fast Global Search to instantly find anyone, complete support for native push notifications so you never miss a birthday, and a beautifully redesigned mobile navigation experience.",
		changes: [
			{
				type: "added",
				title: "Instant Global Search",
				description:
					"Quickly jump to any person, setting, or page from anywhere in the app using our lightning-fast search menu. Access it via the top header or simply press Ctrl+K (or ⌘K).",
			},
			{
				type: "added",
				title: "Never Miss a Birthday",
				description:
					"We've introduced a complete notification system! Get beautifully animated in-app reminders and opt-in to native push notifications to receive alerts straight to your device.",
			},
			{
				type: "improved",
				title: "Sleeker Mobile Navigation",
				description:
					"We've completely revamped the mobile experience with a new responsive bottom navigation bar, freeing up screen space and making the app feel more native.",
			},
			{
				type: "improved",
				title: "Dynamic Branding",
				description:
					"Enhanced the internal engine to dynamically manage branding elements and keep your analytics beautifully organized.",
			},
			{
				type: "fixed",
				title: "Polished Layouts",
				description:
					"Smoothed out minor visual quirks, fixed calendar synchronization glitches, and ensured avatars look pixel-perfect everywhere you go.",
			},
		],
	},
	{
		version: "1.8.0",
		date: "2026-09-01",
		title: "Person Profiles & SEO Polish",
		summary:
			"We've introduced dedicated Person Profiles so you can view all relationship details in one place, added an audio confirmation to Device Sync, and improved the app's internal SEO and rendering performance.",
		changes: [
			{
				type: "added",
				title: "Person Profiles",
				description:
					"A dedicated profile screen for each person to elegantly view their upcoming birthday, current age, relationship, and any saved notes or gift ideas.",
			},
			{
				type: "added",
				title: "Device Sync Audio Feedback",
				description:
					"Added a delightful audio confirmation when you successfully complete a device synchronization, so you know exactly when your data is safely transferred.",
			},
			{
				type: "improved",
				title: "Sleeker Performance & SEO",
				description:
					"We refactored some of the heaviest parts of the app for smoother performance, lazy-loaded new screens, and added route-specific SEO and social media preview tags.",
			},
			{
				type: "improved",
				title: "Refined Quick Actions",
				description:
					"Added a pulsing notification indicator to the closed Quick Actions tab to make it more noticeable at first glance.",
			},
			{
				type: "fixed",
				title: "Ironclad Routing",
				description:
					"Prevented search engines from indexing private links and fixed a 'page not found' issue when navigating directly to a Person Profile.",
			},
		],
	},
	{
		version: "1.7.0",
		date: "2026-08-31",
		title: "Install Prompts & App Enhancements",
		summary:
			"We've added a seamless way to install the app on your device, introduced a new Gift Ideas feature, and refined the overall design and sharing experience.",
		changes: [
			{
				type: "added",
				title: "Install App Banner",
				description:
					"Easily install the app to your home screen! We've added a smart banner that prompts you to install the app at just the right time, without getting in your way.",
			},
			{
				type: "added",
				title: "Gift Ideas & Wishlists",
				description:
					"You can now save up to 10 favorite things or gift ideas for each person. This is perfect for remembering exactly what to get them on their special day!",
			},
			{
				type: "improved",
				title: "Polished Sharing Experience",
				description:
					"We redesigned the invitation and response screens to look even better, added celebratory confetti when sharing links, and made sure expired links are clearly disabled.",
			},
			{
				type: "improved",
				title: "Better First Impressions",
				description:
					"Our first-time tutorial now guides you through the bottom navigation links, and we made sure the 'Age' on today's birthdays is crystal clear instead of saying 'Turning'.",
			},
			{
				type: "fixed",
				title: "Ironclad Imports",
				description:
					"Fixed several edge cases with importing calendar files, ensuring your gift ideas and long notes always import perfectly without breaking the app.",
			},
		],
	},
	{
		version: "1.6.0",
		date: "2026-08-30",
		title: "Data Safety & Blazing Speed",
		summary:
			"We've added a smart backup reminder so your data is always safe, completely rebuilt the rendering engine for lightning-fast performance, and polished the overall look and feel.",
		changes: [
			{
				type: "added",
				title: "Smart Backup Reminders",
				description:
					"We've introduced a friendly, non-intrusive backup reminder on your dashboard. It gently nudges you to save a copy of your data if you haven't backed up in the last 30 days!",
			},
			{
				type: "improved",
				title: "Lightning Fast Performance",
				description:
					"We've integrated a powerful new engine under the hood that makes the app incredibly fast and responsive, especially when scrolling through hundreds of birthdays.",
			},
			{
				type: "improved",
				title: "Accessibility & Security",
				description:
					"Device sync is now much more screen-reader friendly, and we've added extra security layers to invitation links and your local storage.",
			},
			{
				type: "fixed",
				title: "Timezone Polish & UI Tweaks",
				description:
					"Fixed a few edge-cases involving timezones and made sure error pages look just as beautiful as the rest of the app.",
			},
		],
	},
	{
		version: "1.5.0",
		date: "2026-08-29",
		title: "Playful Feedback & Smoother Connections",
		summary:
			"We've added beautiful new interactive logos, vastly improved the Device Sync experience, and optimized the app's performance under the hood.",
		changes: [
			{
				type: "added",
				title: "Playful Feedback & Recovery",
				description:
					"Added brand new animated logo variations for empty states, plus a beautifully designed 404 page to gracefully guide you back if you ever get lost.",
			},
			{
				type: "improved",
				title: "Smoother Device Sync",
				description:
					"Syncing your data across devices is now less stressful! We added granular, step-by-step visual and audio feedback so you know exactly when the connection is waiting or transferring.",
			},
			{
				type: "improved",
				title: "First-Time Magic",
				description:
					"New to the app? We added a 'Preview Celebration' mode so you can instantly experience the confetti and floating messages right after adding your first person.",
			},
			{
				type: "improved",
				title: "Focusing on People",
				description:
					"We've refined our wording across the app—like changing 'Add Birthday' to 'Add a Person'—to better reflect that this app is about the relationships you cherish.",
			},
			{
				type: "fixed",
				title: "Under the Hood Power-Ups",
				description:
					"We optimized our build process for even faster load times, fortified the data recovery mechanisms during startup, and laid the architectural groundwork for the future of React.",
			},
		],
	},
	{
		version: "1.4.0",
		date: "2026-08-28",
		title: "Interactive Calendar & Granular Ages",
		summary:
			"A brand new interactive monthly calendar on your dashboard, enhanced import previews, and precise age tracking for the little ones.",
		changes: [
			{
				type: "added",
				title: "Interactive Birthday Calendar",
				description:
					"We've added a fully interactive, month-based calendar view on the dashboard! Easily browse and click on dates to see celebrants directly on the calendar grid.",
			},
			{
				type: "added",
				title: "Granular Baby Ages",
				description:
					"Age display is now much smarter for babies, precisely showing 'months old', 'days old', or 'Newborn' so you can track those early milestones.",
			},
			{
				type: "added",
				title: "Settings Import Preview",
				description:
					"Importing a settings backup? You can now visually review and compare the incoming settings against your current configuration before applying them.",
			},
			{
				type: "improved",
				title: "Smart Empty States",
				description:
					"Added helpful, animated empty states across the Quick Action Toolbar and Settings so you always know what to do when your lists are empty.",
			},
			{
				type: "improved",
				title: "Performance & Stability",
				description:
					"Major performance improvements! The heavy calendar components are now lazy-loaded, P2P sync edge cases are resolved, and import UX features elegant new notifications.",
			},
		],
	},
	{
		version: "1.3.0",
		date: "2026-08-26",
		title: "Bulk Actions & Custom Greetings",
		summary:
			"Clean up your records faster with bulk deletion tools, and personalize your experience further with custom birthday greetings and a completely redesigned Settings page.",
		changes: [
			{
				type: "added",
				title: "Bulk Actions",
				description:
					"Quickly manage your lists! You can now select and delete multiple birthdays or invitation links at once, saving you time when cleaning up.",
			},
			{
				type: "added",
				title: "Custom Birthday Greetings",
				description:
					"Make it truly yours. You can now define your own personalized birthday greeting messages to be displayed when celebrating a special day.",
			},
			{
				type: "improved",
				title: "Sleeker Settings",
				description:
					"We've completely redesigned the Settings page with a modern, compact layout that feels unified and is easier to navigate.",
			},
			{
				type: "improved",
				title: "Polished Interactions",
				description:
					"Buttons and floating menus have been fine-tuned. Actions on mobile are much cleaner, and accidental historical dates are now prevented.",
			},
		],
	},
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
