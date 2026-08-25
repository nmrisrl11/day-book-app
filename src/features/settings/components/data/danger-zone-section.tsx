import { Button } from "@/components/ui/button";

interface DangerZoneSectionProps {
	onDeleteAllClick: () => void;
	onDeleteAllInvitationsClick: () => void;
	invitationsCount: number;
	birthdaysCount: number;
}

export function DangerZoneSection({
	onDeleteAllClick,
	onDeleteAllInvitationsClick,
	invitationsCount,
	birthdaysCount,
}: DangerZoneSectionProps) {
	return (
		<>
			{birthdaysCount > 0 && (
				<div
					className={`flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between ${invitationsCount > 0 ? "border-b" : ""}`}
				>
					<div className="flex flex-col gap-1 pr-4">
						<h4 className="text-sm font-semibold">Delete All Birthdays</h4>
						<p className="text-muted-foreground text-sm">
							Permanently remove all birthdays. This action cannot be undone.
						</p>
					</div>
					<div className="mt-2 flex w-full shrink-0 items-center gap-2 sm:mt-0 sm:w-auto">
						<Button
							variant="destructive"
							size="sm"
							onClick={onDeleteAllClick}
							aria-label="Delete all birthdays"
							className="w-full sm:w-auto"
						>
							Delete Data
						</Button>
					</div>
				</div>
			)}

			{invitationsCount > 0 && (
				<div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-1 pr-4">
						<h4 className="text-sm font-semibold">Delete All Invitations</h4>
						<p className="text-muted-foreground text-sm">
							Permanently remove all generated invitations. This action cannot be undone.
						</p>
					</div>
					<div className="mt-2 flex w-full shrink-0 items-center gap-2 sm:mt-0 sm:w-auto">
						<Button
							variant="destructive"
							size="sm"
							onClick={onDeleteAllInvitationsClick}
							aria-label="Delete all invitations"
							className="w-full sm:w-auto"
						>
							Delete Data
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
