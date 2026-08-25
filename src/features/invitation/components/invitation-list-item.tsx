import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { InvitationRecord } from "@/lib/db";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckIcon, CopyIcon, SendIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

interface InvitationListItemProps {
	invitation: InvitationRecord;
	selectable?: boolean;
	selected?: boolean;
	onSelectChange?: (id: string, checked: boolean) => void;
	onDelete: (invitation: InvitationRecord) => void;
}

export function InvitationListItem({
	invitation,
	selectable,
	selected,
	onSelectChange,
	onDelete,
}: InvitationListItemProps) {
	const isActive = !invitation.expiresAt || invitation.expiresAt > Date.now();
	const [hasCopied, setHasCopied] = useState(false);

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;
		if (hasCopied) {
			timeoutId = setTimeout(() => {
				setHasCopied(false);
			}, 2000);
		}
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [hasCopied]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(`${window.location.origin}/invite?t=${invitation.token}`);
			setHasCopied(true);
		} catch (e) {
			console.error("Failed to copy", e);
		}
	};

	const handleShare = async () => {
		if (!isActive) return;
		try {
			await navigator.share({
				title: "Share your birthday",
				text: `Hi! I'm adding birthdays to my calendar. Could you share yours with me using this private link?`,
				url: `${window.location.origin}/invite?t=${invitation.token}`,
			});
		} catch (e) {
			console.error("Failed to share", e);
		}
	};

	return (
		<div
			className={cn(
				"border-border bg-card flex items-center justify-between gap-2 rounded-xl border p-3 shadow-sm transition-colors sm:p-4",
				selected && "border-primary/50 bg-primary/5",
			)}
		>
			<div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
				{selectable && (
					<Checkbox
						checked={selected}
						onCheckedChange={(c) => onSelectChange?.(invitation.id, !!c)}
						className="mr-1 shrink-0"
						aria-label={`Select ${invitation.name}'s invitation`}
					/>
				)}
				<div className="flex min-w-0 flex-col">
					<div className="flex items-center gap-2">
						<span className="text-foreground truncate font-semibold">
							{invitation.name}'s Invitation
						</span>
						<span
							className={cn(
								"shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
								isActive ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground",
							)}
						>
							{isActive ? "Active" : "Expired"}
						</span>
					</div>
					<span className="text-muted-foreground cursor-default truncate text-xs sm:text-sm">
						Created:{" "}
						<span title={format(invitation.createdAt, "MMM d, yyyy h:mm a")}>
							{format(invitation.createdAt, "MMM d, yyyy")}
						</span>{" "}
						• Expires:{" "}
						{invitation.expiresAt ? (
							<span title={format(invitation.expiresAt, "MMM d, yyyy h:mm a")}>
								{format(invitation.expiresAt, "MMM d, yyyy")}
							</span>
						) : (
							"Never"
						)}
					</span>
				</div>
			</div>

			<div className="flex shrink-0 items-center gap-0 sm:gap-1">
				<Button
					variant="ghost"
					size="icon"
					onClick={handleCopy}
					aria-label="Copy link"
					className={
						hasCopied
							? "text-green-600 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30"
							: ""
					}
				>
					{hasCopied ? (
						<CheckIcon className="h-4 w-4" aria-hidden="true" />
					) : (
						<CopyIcon className="h-4 w-4" aria-hidden="true" />
					)}
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={handleShare}
					disabled={!isActive}
					aria-label="Share"
				>
					<SendIcon className="h-4 w-4" aria-hidden="true" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="hover:bg-destructive/10 hover:text-destructive"
					onClick={() => onDelete(invitation)}
					aria-label={`Delete ${invitation.name}'s invitation`}
				>
					<Trash2Icon className="h-4 w-4" aria-hidden="true" />
				</Button>
			</div>
		</div>
	);
}
