import { HelpCircleIcon } from "lucide-react";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface InfoTooltipProps {
	content: React.ReactNode;
	label?: React.ReactNode;
	ariaLabel?: string;
}

export function InfoTooltip({ content, label, ariaLabel }: InfoTooltipProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
					aria-label={ariaLabel || "More information"}
				>
					{label && <span>{label}</span>}
					<HelpCircleIcon className="h-4 w-4" />
				</button>
			</PopoverTrigger>
			<PopoverContent className="max-w-xs text-sm leading-relaxed" side="top">
				{content}
			</PopoverContent>
		</Popover>
	);
}
