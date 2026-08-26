import { InfoTooltip } from "@/components/info-tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportInvitations, parseImportedInvitations } from "@/helpers/import-export";
import type { InvitationRecord } from "@/lib/db";
import { InvitationRepository } from "@/lib/invitation-repository";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function InvitationsDataManagement() {
	const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
	const fileInputInvitationsRef = useRef<HTMLInputElement>(null);
	const [importError, setImportError] = useState("");

	useEffect(() => {
		InvitationRepository.getAll().then(setInvitations);
	}, []);

	const handleExport = () => {
		exportInvitations(invitations);
	};

	const handleImportClick = () => {
		fileInputInvitationsRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setImportError("");
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const imported = parseImportedInvitations(text);
			if (imported.length > 0) {
				await InvitationRepository.bulkAdd(imported);
				const updated = await InvitationRepository.getAll();
				setInvitations(updated);
			} else {
				throw new Error("No valid invitations found in file.");
			}
		} catch (err) {
			setImportError(err instanceof Error ? err.message : "Failed to import invitations.");
		} finally {
			if (fileInputInvitationsRef.current) {
				fileInputInvitationsRef.current.value = "";
			}
		}
	};

	return (
		<div className="flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-col gap-1 pr-4">
				<div className="flex items-center gap-2">
					<h4 className="text-sm font-semibold">Invitations Data (JSON)</h4>
					<InfoTooltip
						ariaLabel="More information about Invitations Data"
						content={
							<span>
								Exporting your invitations allows you to restore your active links on a new device,
								so you can continue managing and tracking them.
							</span>
						}
					/>
				</div>
				<p className="text-muted-foreground text-sm">
					Backup or restore your generated invitation links
				</p>
			</div>
			<div className="mt-2 grid w-full grid-cols-2 gap-2 sm:mt-0 sm:flex sm:w-auto sm:items-center">
				<Button
					variant="outline"
					size="sm"
					onClick={handleExport}
					disabled={invitations.length === 0}
					aria-label="Export invitations"
					className="w-full gap-2 sm:w-auto"
				>
					<DownloadIcon className="h-3.5 w-3.5" />
					Export
				</Button>

				<div className="relative flex w-full flex-col items-center sm:w-auto sm:items-end">
					<Button
						variant="outline"
						size="sm"
						onClick={handleImportClick}
						aria-label="Import invitations"
						className="w-full gap-2 sm:w-auto"
					>
						<UploadIcon className="h-3.5 w-3.5" />
						Import
					</Button>
					{importError && (
						<span
							className="text-destructive mt-1.5 w-max max-w-50 text-center text-[11px] leading-tight font-medium sm:text-right"
							role="alert"
						>
							{importError}
						</span>
					)}
				</div>
				<Input
					id="import-invitations-file"
					type="file"
					accept=".json,application/json"
					className="hidden"
					ref={fileInputInvitationsRef}
					onChange={handleFileChange}
					aria-label="Select file to import invitations"
				/>
			</div>
		</div>
	);
}
