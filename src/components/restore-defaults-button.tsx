import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";

interface RestoreDefaultsButtonProps {
	onClick: () => void;
	title?: string;
	ariaLabel?: string;
	iconOnly?: boolean;
}

export function RestoreDefaultsButton({
	onClick,
	title = "Restore defaults",
	ariaLabel = "Restore defaults",
	iconOnly = false,
}: RestoreDefaultsButtonProps) {
	if (iconOnly) {
		return (
			<Button
				variant="ghost"
				size="icon"
				className="hover:bg-muted h-6 w-6 rounded-full"
				onClick={onClick}
				title={title}
				aria-label={ariaLabel}
			>
				<RotateCcwIcon className="text-muted-foreground h-3.5 w-3.5" />
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			className="text-muted-foreground hover:text-foreground h-8 text-xs"
			onClick={onClick}
			title={title}
			aria-label={ariaLabel}
		>
			<RotateCcwIcon className="h-3 w-3 sm:mr-1.5" />
			<span className="hidden sm:inline">Restore Defaults</span>
		</Button>
	);
}
