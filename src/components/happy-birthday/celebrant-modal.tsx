import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { PartyHat } from "@/components/ui/party-hat";
import { GREETINGS } from "@/constants/greetings";
import { calculateAge, formatBirthdayDisplay } from "@/helpers/birthday-utils";
import { type Birthday } from "@/types/birthday";
import Avvvatars from "avvvatars-react";
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
	// Randomly select a greeting when the modal opens
	const greeting = useMemo(() => {
		if (!celebrant) return "";
		const randomIndex = Math.floor(Math.random() * GREETINGS.length);
		return GREETINGS[randomIndex];
	}, [celebrant]); // Re-roll greeting if a new celebrant is opened

	if (!celebrant) return null;

	const age = calculateAge(celebrant.birthday, currentDate);
	const formattedDate = formatBirthdayDisplay(celebrant.birthday);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="rounded-2xl border-border/50 bg-background/90 shadow-2xl backdrop-blur-md sm:max-w-md">
				<DialogHeader className="flex flex-col items-center space-y-3 py-6 text-center">
					<div className="relative">
						<div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />

						<div className="absolute -top-9 right-0 z-20 h-14 w-14 rotate-12 drop-shadow-md">
							<PartyHat className="h-full w-full" />
						</div>

						<div className="relative z-10 rounded-full bg-background p-2 shadow-sm ring-1 ring-border">
							{celebrant.avatar ? (
								<img
									src={celebrant.avatar}
									alt={celebrant.name}
									className="h-24 w-24 rounded-full object-cover"
								/>
							) : (
								<div className="[&>svg]:h-24 [&>svg]:w-24">
									<Avvvatars value={celebrant.name} style="shape" size={96} />
								</div>
							)}
						</div>
					</div>

					<DialogTitle className="font-sans text-2xl font-bold text-foreground">
						{celebrant.name}
					</DialogTitle>

					<DialogDescription asChild>
						<div className="mt-2 flex flex-col items-center gap-4 text-muted-foreground">
							<div className="flex flex-wrap items-center justify-center gap-3">
								<Badge variant="secondary" className="text-sm font-bold p-3">
									<CalendarIcon data-icon="inline-start" />
									{formattedDate}
								</Badge>

								{age !== null && (
									<Badge variant="destructive" className="text-sm font-bold p-3">
										<GiftIcon data-icon="inline-start" />
										Turning {age}
									</Badge>
								)}
							</div>

							<p className="text-base leading-relaxed text-secondary-foreground italic">
								"{greeting}"
							</p>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
