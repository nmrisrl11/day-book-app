import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";

interface RestoreDefaultsButtonProps {
	onClick: () => void;
	title?: string;
	ariaLabel?: string;
}

export function RestoreDefaultsButton({
	onClick,
	title = "Restore defaults",
	ariaLabel = "Restore defaults",
}: RestoreDefaultsButtonProps) {
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
