import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { useBirthdayData } from "@/hooks/use-birthday-data";
import { useSearchStore } from "@/store/search-store";
import {
	BookUserIcon,
	DatabaseIcon,
	DownloadIcon,
	InfoIcon,
	LayoutDashboardIcon,
	LinkIcon,
	MessageSquareIcon,
	PaintbrushIcon,
	SettingsIcon,
	StarIcon,
	UserRoundIcon,
	Volume2Icon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "./user-avatar";

const PAGES = [
	{ name: "Dashboard", path: "/", icon: LayoutDashboardIcon },
	{ name: "Birthdays", path: "/manage", icon: BookUserIcon },
	{ name: "Invitations", path: "/invitations", icon: LinkIcon },
	{ name: "Settings", path: "/settings", icon: SettingsIcon },
	{ name: "Install App", path: "/install", icon: DownloadIcon },
	{ name: "About", path: "/about", icon: InfoIcon },
];

const SETTINGS_TABS = [
	{ name: "Appearance", path: "/settings?tab=appearance", icon: PaintbrushIcon },
	{ name: "Avatar", path: "/settings?tab=avatar", icon: UserRoundIcon },
	{ name: "Main Greeting", path: "/settings?tab=main-greeting", icon: StarIcon },
	{ name: "Messages & Greetings", path: "/settings?tab=messages", icon: MessageSquareIcon },
	{ name: "Sound & Feedback", path: "/settings?tab=sounds", icon: Volume2Icon },
	{ name: "Data Management", path: "/settings?tab=data", icon: DatabaseIcon },
];

export function GlobalSearch() {
	const { isOpen, setIsOpen } = useSearchStore();
	const navigate = useNavigate();
	const { birthdays } = useBirthdayData();
	const [searchQuery, setSearchQuery] = useState("");

	// Clear search query when dialog closes
	useEffect(() => {
		if (!isOpen) {
			setSearchQuery("");
		}
	}, [isOpen]);

	const runCommand = (command: () => void) => {
		setIsOpen(false);
		command();
	};

	// We filter people manually to avoid rendering thousands of DOM nodes.
	// We mimic a "server-side" limit by taking the top 50 matches.
	const filteredPeople = useMemo(() => {
		if (!birthdays) return [];
		if (!searchQuery) return birthdays.slice(0, 50);

		const lowerQuery = searchQuery.toLowerCase();
		return birthdays.filter((b) => b.name.toLowerCase().includes(lowerQuery)).slice(0, 50);
	}, [birthdays, searchQuery]);

	return (
		<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
			<CommandInput
				placeholder="Search for people, pages, or settings..."
				value={searchQuery}
				onValueChange={setSearchQuery}
			/>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				<CommandGroup heading="Pages">
					{PAGES.map((page) => (
						<CommandItem key={page.path} onSelect={() => runCommand(() => navigate(page.path))}>
							<page.icon className="mr-2 h-4 w-4" aria-hidden="true" />
							<span>{page.name}</span>
						</CommandItem>
					))}
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="Settings">
					{SETTINGS_TABS.map((tab) => (
						<CommandItem key={tab.path} onSelect={() => runCommand(() => navigate(tab.path))}>
							<tab.icon className="mr-2 h-4 w-4" aria-hidden="true" />
							<span>{tab.name}</span>
						</CommandItem>
					))}
				</CommandGroup>

				{filteredPeople && filteredPeople.length > 0 && (
					<>
						<CommandSeparator />
						<CommandGroup heading="People">
							{filteredPeople.map((birthday) => (
								<CommandItem
									key={birthday.id}
									value={`person ${birthday.name} ${birthday.id}`}
									onSelect={() => runCommand(() => navigate(`/person/${birthday.id}`))}
								>
									<UserAvatar birthday={birthday} size={24} className="mr-2 h-6 w-6" />
									<span>{birthday.name}</span>
								</CommandItem>
							))}
						</CommandGroup>
					</>
				)}
			</CommandList>
		</CommandDialog>
	);
}
