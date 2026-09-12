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
				className="h-6 w-6 rounded-full hover:bg-muted"
				onClick={onClick}
				title={title}
				aria-label={ariaLabel}
			>
				<RotateCcwIcon className="h-3.5 w-3.5 text-muted-foreground" />
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			className="h-8 text-xs text-muted-foreground hover:text-foreground"
			onClick={onClick}
			title={title}
			aria-label={ariaLabel}
		>
			<RotateCcwIcon className="h-3 w-3 sm:mr-1.5" />
			<span className="hidden sm:inline">Restore Defaults</span>
		</Button>
	);
}
