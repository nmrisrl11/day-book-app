import { PartyHat } from "@/components/ui/party-hat";
import { MAIN_GREETINGS } from "@/constants/main-greeting";
import { useConfetti } from "@/hooks/use-confetti";
import { cn } from "@/lib/utils";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import type { Birthday } from "@/types/birthday";
import { StarIcon } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { CelebrantDisplay } from "./celebrant-display";
import { FloatingMessages } from "./floating-messages";

const CelebrantModal = lazy(() =>
	import("./celebrant-modal").then((m) => ({ default: m.CelebrantModal })),
);

interface HappyBirthdaySectionProps {
	celebrants: Birthday[];
	currentDate: Date;
}

export function HappyBirthdaySection({ celebrants, currentDate }: HappyBirthdaySectionProps) {
	const [selectedCelebrant, setSelectedCelebrant] = useState<Birthday | null>(null);
	const { settings } = useDayBookStore();
	const greetingSettings = settings.greetingTextSettings || defaultSettings.greetingTextSettings!;

	const randomGradientAngle = useMemo(() => Math.floor(Math.random() * 360), []);

	const hasCelebrants = celebrants.length > 0;

	useConfetti(hasCelebrants);

	if (!hasCelebrants) {
		return (
			<div className="flex min-h-[40vh] w-full flex-col items-center justify-center text-center">
				<h1 className="text-muted-foreground mb-4 text-2xl font-bold tracking-tight uppercase md:text-4xl">
					No Birthdays Today
				</h1>
				<p className="text-muted-foreground">Check out the upcoming birthdays below!</p>
			</div>
		);
	}

	return (
		<div className="relative z-10 flex min-h-[50vh] w-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] py-16 text-center">
			{/* Grid Background */}
			<div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[24px_24px]" />

			{/* Floating Messages */}
			<FloatingMessages enabled={hasCelebrants} />

			<div className="relative mb-8 md:mb-12">
				<div className="absolute -top-6 -left-4 -rotate-12 md:-top-10 md:-left-12">
					<PartyHat className="h-10 w-10 md:h-14 md:w-14" />
				</div>

				<div className="absolute top-2 -right-4 rotate-12 opacity-70 md:-right-10">
					<StarIcon className="h-6 w-6 fill-yellow-400 text-yellow-400 md:h-8 md:w-8" />
				</div>

				<h1
					className={cn(
						"max-w-full px-4 pb-2 text-5xl leading-normal font-extrabold tracking-tight break-all drop-shadow-sm md:text-7xl",
						greetingSettings.type === "gradient" ? "bg-clip-text text-transparent" : "",
					)}
					style={{
						...(greetingSettings.fontFamily ? { fontFamily: greetingSettings.fontFamily } : {}),
						...(greetingSettings.type === "gradient"
							? {
									backgroundImage: `linear-gradient(${
										greetingSettings.gradient.direction === "random"
											? `${randomGradientAngle}deg`
											: greetingSettings.gradient.direction
									}, ${greetingSettings.gradient.start}, ${greetingSettings.gradient.end})`,
								}
							: { color: greetingSettings.solidColor }),
					}}
				>
					{greetingSettings.text || MAIN_GREETINGS[0]}
				</h1>
			</div>

			<div
				className={cn(
					"relative z-10 flex w-full flex-wrap items-center justify-center gap-8 md:gap-12",
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

			{!!selectedCelebrant && (
				<Suspense fallback={null}>
					<CelebrantModal
						celebrant={selectedCelebrant}
						isOpen={!!selectedCelebrant}
						onClose={() => setSelectedCelebrant(null)}
						currentDate={currentDate}
					/>
				</Suspense>
			)}
		</div>
	);
}
