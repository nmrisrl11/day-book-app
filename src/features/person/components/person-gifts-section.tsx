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
		<div className="bg-amber-500/5 border-amber-500/20 relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 shadow-sm">
			<div className="absolute top-0 right-0 p-4 opacity-5">
				<GiftIcon className="h-24 w-24" />
			</div>

			<div className="relative z-10 flex items-center justify-between mb-4">
				<h3 className="text-amber-800 dark:text-amber-400 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider">
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
								className="border-amber-500/30 shadow-black/5 bg-background/50 h-auto max-w-full whitespace-normal wrap-break-word py-1.5 px-3 text-left shadow-sm backdrop-blur-sm text-sm"
							>
								<span
									className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/80"
									aria-hidden="true"
								/>
								<span className="min-w-0 wrap-break-word font-normal">{idea}</span>
							</Badge>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center text-center py-6">
						<h4 className="text-foreground font-semibold mb-1">Gift ideas</h4>
						<p className="text-muted-foreground text-sm mb-4 max-w-xs">
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
