import { Button } from "@/components/ui/button";

interface DangerZoneSectionProps {
	onDeleteAllClick: () => void;
}

export function DangerZoneSection({ onDeleteAllClick }: DangerZoneSectionProps) {
	return (
		<div className="border-destructive/20 bg-destructive/5 flex flex-col gap-3 rounded-xl border p-4">
			<div className="flex flex-col gap-1">
				<h3 className="text-destructive text-base font-bold">Danger Zone</h3>
				<p className="text-muted-foreground text-sm">
					Permanently remove all birthdays. This action cannot be undone.
				</p>
			</div>
			<Button variant="destructive" onClick={onDeleteAllClick} aria-label="Delete all birthdays">
				Delete All Birthdays
			</Button>
		</div>
	);
}
