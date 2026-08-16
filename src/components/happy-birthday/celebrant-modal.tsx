import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { PartyHat } from "@/components/ui/party-hat";
import { UserAvatar } from "@/components/user-avatar";
import { calculateAge, formatBirthdayDisplay } from "@/helpers/birthday-utils";
import { useDayBookStore } from "@/store/day-book-store";
import { type Birthday } from "@/types/birthday";
import { CalendarIcon, GiftIcon } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "../ui/badge";

interface CelebrantModalProps {
	celebrant: Birthday | null;
	isOpen: boolean;
	onClose: () => void;
	currentDate: Date;
}

export function CelebrantModal({ celebrant, isOpen, onClose, currentDate }: CelebrantModalProps) {
	const { settings } = useDayBookStore();

	// Randomly select a greeting when the modal opens
	const greeting = useMemo(() => {
		if (!celebrant) return "";
		const greetingsList =
			settings.greetings && settings.greetings.length > 0
				? settings.greetings
				: ["Happy Birthday!"];
		const randomIndex = Math.floor(Math.random() * greetingsList.length);
		return greetingsList[randomIndex];
	}, [celebrant, settings.greetings]); // Re-roll greeting if a new celebrant is opened

	if (!celebrant) return null;

	const age = calculateAge(celebrant.birthday, currentDate);
	const formattedDate = formatBirthdayDisplay(celebrant.birthday);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="border-border/50 bg-background/90 rounded-2xl shadow-2xl backdrop-blur-md sm:max-w-md">
				<DialogHeader className="flex flex-col items-center space-y-3 py-6 text-center">
					<div className="relative">
						<div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />

						<div className="absolute -top-9 right-0 z-20 h-14 w-14 rotate-12 drop-shadow-md">
							<PartyHat className="h-full w-full" />
						</div>

						<div className="bg-background ring-border relative z-10 rounded-full p-2 shadow-sm ring-1">
							<UserAvatar birthday={celebrant} size={96} className="h-24 w-24" />
						</div>
					</div>

					<DialogTitle className="text-foreground font-sans text-2xl font-bold">
						{celebrant.name}
					</DialogTitle>

					<DialogDescription asChild>
						<div className="text-muted-foreground mt-2 flex flex-col items-center gap-4">
							<div className="flex flex-wrap items-center justify-center gap-3">
								<Badge variant="secondary" className="p-3 text-sm font-bold">
									<CalendarIcon data-icon="inline-start" />
									{formattedDate}
								</Badge>

								{age !== null && (
									<Badge variant="destructive" className="p-3 text-sm font-bold">
										<GiftIcon data-icon="inline-start" />
										Turning {age}
									</Badge>
								)}
							</div>

							<p className="text-secondary-foreground text-base leading-relaxed italic">
								"{greeting}"
							</p>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
