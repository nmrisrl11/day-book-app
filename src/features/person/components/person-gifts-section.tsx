import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Birthday } from "@/types/birthday";
import { GiftIcon, PlusIcon, StarIcon } from "lucide-react";

interface PersonGiftsSectionProps {
	person: Birthday;
	onAddGift: () => void;
}

export function PersonGiftsSection({ person, onAddGift }: PersonGiftsSectionProps) {
	const hasGifts = person.giftIdeas && person.giftIdeas.length > 0;

	return (
		<div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-sm">
			<div className="absolute top-0 right-0 p-4 opacity-5">
				<GiftIcon className="h-24 w-24" />
			</div>

			<div className="relative z-10 mb-4 flex items-center justify-between">
				<h3 className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-amber-800 uppercase dark:text-amber-400">
					<StarIcon className="h-4 w-4 fill-amber-500/50" />
					Wishlist & Gift Ideas
				</h3>
				{hasGifts && (
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 rounded-full p-0 text-amber-600 hover:bg-amber-500/20 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
						onClick={onAddGift}
						aria-label="Add Gift Idea"
					>
						<PlusIcon className="h-4 w-4" />
					</Button>
				)}
			</div>

			<div className="relative z-10 flex flex-1 flex-col justify-center">
				{hasGifts ? (
					<div className="flex flex-wrap gap-2">
						{person.giftIdeas!.map((idea, index) => (
							<Badge
								key={index}
								variant="outline"
								className="h-auto max-w-full border-amber-500/30 bg-background/50 px-3 py-1.5 text-left text-sm wrap-break-word whitespace-normal shadow-sm shadow-black/5 backdrop-blur-sm"
							>
								<span
									className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/80"
									aria-hidden="true"
								/>
								<span className="min-w-0 font-normal wrap-break-word">{idea}</span>
							</Badge>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center py-6 text-center">
						<h4 className="mb-1 font-semibold text-foreground">Gift ideas</h4>
						<p className="mb-4 max-w-xs text-sm text-muted-foreground">
							Save ideas throughout the year so you're never stuck wondering what to get.
						</p>
						<Button size="sm" variant="warning" onClick={onAddGift}>
							Add gift idea
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
