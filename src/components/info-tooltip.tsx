import { HelpCircleIcon } from "lucide-react";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface InfoTooltipProps {
	content: React.ReactNode;
	label?: React.ReactNode;
}

export function InfoTooltip({ content, label }: InfoTooltipProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 transition-colors"
					aria-label="More information"
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
