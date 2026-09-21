import { PartyHat } from "@/components/icons/party-hat";
import { UserAvatar } from "@/components/user-avatar";
import { useMediaQuery } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Birthday } from "@/types/birthday";
import { CakeIcon, SparklesIcon, StarIcon } from "lucide-react";

interface CelebrantDisplayProps {
	celebrant: Birthday;
	onClick: (celebrant: Birthday) => void;
	isCompact?: boolean;
}

export function CelebrantDisplay({ celebrant, onClick, isCompact = false }: CelebrantDisplayProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const avatarSizeDesktop = isCompact ? 100 : 160;
	const avatarSizeMobile = isCompact ? 80 : 128;
	const avatarSize = isDesktop ? avatarSizeDesktop : avatarSizeMobile;

	return (
		<button
			onClick={() => onClick(celebrant)}
			className={cn(
				"group relative flex flex-col items-center gap-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
				isCompact ? "p-3 md:p-4" : "p-6",
			)}
			aria-label={`View details for ${celebrant.name}`}
		>
			<div className="relative">
				<StarIcon
					className={cn(
						"absolute animate-pulse fill-yellow-400 text-yellow-400 delay-75",
						isCompact ? "-top-1 -left-2 h-4 w-4" : "-top-2 -left-4 h-6 w-6",
					)}
				/>
				<SparklesIcon
					className={cn(
						"absolute animate-pulse text-pink-400 delay-300",
						isCompact ? "-bottom-1 -left-2 h-4 w-4" : "-bottom-2 -left-4 h-5 w-5",
					)}
				/>
				<CakeIcon
					className={cn(
						"absolute animate-pulse text-blue-400 delay-300",
						isCompact ? "top-12 -right-6 h-5 w-5" : "top-20 -right-10 h-7 w-7",
					)}
				/>

				<div
					className={cn(
						"absolute z-20 rotate-12 drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-20",
						isCompact
							? "-top-4 right-0 h-8 w-8 md:-top-5 md:right-1 md:h-10 md:w-10"
							: "-top-6 right-2 h-12 w-12 md:-top-8 md:right-4 md:h-16 md:w-16",
					)}
				>
					<PartyHat className="h-full w-full" />
				</div>

				<div className="relative z-10 rounded-full bg-card p-2 shadow-lg ring-1 ring-border transition-transform duration-300 group-hover:scale-105">
					<UserAvatar
						birthday={celebrant}
						size={avatarSize}
						className={isCompact ? "h-20 w-20 md:h-25 md:w-25" : "h-32 w-32 md:h-40 md:w-40"}
					/>
				</div>
			</div>

			<div className="flex flex-col items-center">
				<h2
					className={cn(
						"text-center font-bold tracking-tight text-foreground",
						isCompact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl",
					)}
				>
					{celebrant.name}
				</h2>
			</div>
		</button>
	);
}
