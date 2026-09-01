import { PartyHat } from "@/components/icons/party-hat";
import { Button } from "@/components/ui/button";
import { formatAgeDisplay, formatBirthdayDisplay } from "@/helpers/birthday-utils";
import { cn } from "@/lib/utils";
import type { Birthday } from "@/types/birthday";
import type { VirtualItem as TanstackVirtualItem } from "@tanstack/react-virtual";
import React, { memo, useMemo } from "react";
import type { VirtualItem } from "./import-preview-dialog";

export const VirtualHeaderRow = memo(
	({
		item,
		virtualRow,
		allSelectedInMonth,
		toggleMonth,
	}: {
		item: Extract<VirtualItem, { type: "header" }>;
		virtualRow: TanstackVirtualItem;
		allSelectedInMonth: boolean;
		toggleMonth: (celebrantIds: string[], selectAll: boolean) => void;
	}) => {
		const celebrantIds = useMemo(() => item.celebrants.map((b) => b.id), [item.celebrants]);

		return (
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: `${virtualRow.size}px`,
					transform: `translateY(${virtualRow.start}px)`,
				}}
				className="bg-background/95 z-10 flex items-center justify-between pt-2 pb-2"
			>
				<h4 className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
					{item.month}
				</h4>
				<Button
					variant="ghost"
					size="sm"
					className="text-primary h-auto p-0 text-xs hover:bg-transparent"
					onClick={() => toggleMonth(celebrantIds, allSelectedInMonth)}
				>
					{allSelectedInMonth ? "Deselect All" : "Select All"}
				</Button>
			</div>
		);
	},
);

export const VirtualBirthdayRow = memo(
	({
		b,
		virtualRow,
		duplicate,
		isSelected,
		isBday,
		toggleSelection,
	}: {
		b: Birthday;
		virtualRow: TanstackVirtualItem;
		duplicate: boolean;
		isSelected: boolean;
		isBday: boolean;
		toggleSelection: (id: string) => void;
	}) => {
		const notesCount = b.notes?.length || 0;
		const giftIdeasCount = b.giftIdeas?.length || 0;

		const details = [
			b.relationship && b.relationship !== "Other" ? b.relationship : null,
			notesCount > 0 ? `${notesCount} ${notesCount === 1 ? "note" : "notes"}` : null,
			giftIdeasCount > 0 ? `${giftIdeasCount} ${giftIdeasCount === 1 ? "idea" : "ideas"}` : null,
		].filter(Boolean) as string[];

		return (
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: `${virtualRow.size}px`,
					transform: `translateY(${virtualRow.start}px)`,
					paddingBottom: "8px",
				}}
			>
				<label
					className={cn(
						"flex h-full items-center gap-3 rounded-xl border p-3 transition-colors",
						duplicate ? "cursor-not-allowed opacity-50" : "cursor-pointer",
						isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
						isBday && "relative overflow-hidden",
					)}
				>
					{isBday && (
						<div className="absolute top-1 -right-3 -z-10 -rotate-45">
							<PartyHat className="h-20 w-20" />
						</div>
					)}

					<input
						type="checkbox"
						className="text-primary focus:ring-primary accent-primary h-4 w-4 rounded border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
						checked={isSelected}
						disabled={duplicate}
						onChange={() => toggleSelection(b.id)}
					/>
					<div className="flex flex-1 flex-col overflow-hidden justify-center gap-0.5">
						<div className="flex items-center gap-2 truncate">
							<span className="text-foreground shrink-0 truncate text-sm font-bold">{b.name}</span>

							{details.length > 0 && (
								<div className="text-muted-foreground flex items-center gap-1.5 truncate text-[10px] font-bold tracking-wider uppercase">
									{details.map((detail) => (
										<React.Fragment key={detail}>
											<span className="opacity-50">•</span>
											<span className="shrink-0 truncate">{detail}</span>
										</React.Fragment>
									))}
								</div>
							)}
						</div>

						<span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
							<span>{formatBirthdayDisplay(b.birthday)}</span>
							{(() => {
								const ageDisplay = formatAgeDisplay(b.birthday, new Date());
								if (ageDisplay !== null) {
									return (
										<>
											<span className="opacity-50">•</span>
											<span>{ageDisplay}</span>
										</>
									);
								}
								return null;
							})()}
						</span>
					</div>
					{duplicate && (
						<span className="text-muted-foreground bg-muted shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
							Exists
						</span>
					)}
				</label>
			</div>
		);
	},
);
