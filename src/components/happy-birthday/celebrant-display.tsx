import { PartyHat } from "@/components/ui/party-hat";
import type { Birthday } from "@/types/birthday";
import Avvvatars from "avvvatars-react";
import { CakeIcon, SparklesIcon, StarIcon } from "lucide-react";

interface CelebrantDisplayProps {
	celebrant: Birthday;
	onClick: (celebrant: Birthday) => void;
}

export function CelebrantDisplay({ celebrant, onClick }: CelebrantDisplayProps) {
	return (
		<button
			onClick={() => onClick(celebrant)}
			className="group relative flex flex-col items-center gap-4 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
			aria-label={`View details for ${celebrant.name}`}
		>
			<div className="relative">
				<StarIcon className="absolute -top-2 -left-4 h-6 w-6 animate-pulse fill-yellow-400 text-yellow-400 delay-75" />
				<SparklesIcon className="absolute -bottom-2 -left-4 h-5 w-5 animate-pulse text-pink-400 delay-300" />
				<CakeIcon className="absolute top-20 -right-10 h-7 w-7 animate-pulse text-blue-400 delay-300" />

				<div className="absolute -top-6 right-2 z-20 w-12 h-12 rotate-12 transition-transform duration-300 group-hover:rotate-20 group-hover:scale-110 drop-shadow-md md:w-16 md:h-16 md:-top-8 md:right-4">
					<PartyHat className="w-full h-full" />
				</div>

				<div className="relative z-10 rounded-full bg-card p-2 shadow-lg ring-1 ring-border transition-transform duration-300 group-hover:scale-105">
					{celebrant.avatar ? (
						<img
							src={celebrant.avatar}
							alt={celebrant.name}
							className="h-32 w-32 rounded-full object-cover md:h-40 md:w-40"
						/>
					) : (
						<div className="[&>svg]:h-32 [&>svg]:w-32 md:[&>svg]:h-40 md:[&>svg]:w-40">
							<Avvvatars value={celebrant.name} style="shape" size={160} />
						</div>
					)}
				</div>
			</div>

			<div className="flex flex-col items-center">
				<h3 className="text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					{celebrant.name}
				</h3>
			</div>
		</button>
	);
}
