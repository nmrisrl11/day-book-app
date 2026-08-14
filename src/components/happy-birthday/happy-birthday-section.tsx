import { PartyHat } from "@/components/ui/party-hat";
import { useConfetti } from "@/hooks/use-confetti";
import { cn } from "@/lib/utils";
import type { Birthday } from "@/types/birthday";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { CelebrantDisplay } from "./celebrant-display";
import { CelebrantModal } from "./celebrant-modal";
import { FloatingMessages } from "./floating-messages";

interface HappyBirthdaySectionProps {
	celebrants: Birthday[];
	currentDate: Date;
}

export function HappyBirthdaySection({ celebrants, currentDate }: HappyBirthdaySectionProps) {
	const [selectedCelebrant, setSelectedCelebrant] = useState<Birthday | null>(null);
	const hasCelebrants = celebrants.length > 0;

	useConfetti(hasCelebrants);

	if (!hasCelebrants) {
		return (
			<div className="flex min-h-[40vh] w-full flex-col items-center justify-center text-center">
				<h1 className="mb-4 text-2xl font-bold tracking-tight text-muted-foreground uppercase md:text-4xl">
					No Birthdays Today
				</h1>
				<p className="text-muted-foreground">
					Check out the upcoming birthdays below!
				</p>
			</div>
		);
	}

	return (
		<div className="relative z-10 flex min-h-[50vh] w-full flex-col items-center justify-center py-16 text-center overflow-hidden rounded-[2.5rem]">
			{/* Grid Background */}
			<div
				className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"
			/>

			{/* Floating Messages */}
			<FloatingMessages enabled={hasCelebrants} />

			<div className="relative mb-8 md:mb-12">
				<div className="absolute -top-6 -left-4 md:-top-10 md:-left-12 -rotate-12">
					<PartyHat className="h-10 w-10 md:h-14 md:w-14" />
				</div>

				<div className="absolute top-2 -right-4 opacity-70 rotate-12 md:-right-10">
					<StarIcon className="h-6 w-6 text-yellow-400 fill-yellow-400 md:h-8 md:w-8" />
				</div>

				<h1 className="bg-linear-to-br from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-sm md:text-7xl">
					Happy Birthday!
				</h1>
			</div>

			<div
				className={cn(
					"flex w-full flex-wrap items-center justify-center gap-8 md:gap-12 relative z-10",
					celebrants.length === 1 && "mx-auto max-w-md",
				)}
			>
				{celebrants.map((celebrant) => (
					<CelebrantDisplay
						key={celebrant.id}
						celebrant={celebrant}
						onClick={setSelectedCelebrant}
					/>
				))}
			</div>

			<CelebrantModal
				celebrant={selectedCelebrant}
				isOpen={!!selectedCelebrant}
				onClose={() => setSelectedCelebrant(null)}
				currentDate={currentDate}
			/>
		</div>
	);
}
