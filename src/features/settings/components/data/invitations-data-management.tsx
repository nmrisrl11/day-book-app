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
		<div className="bg-card flex flex-col gap-4 rounded-xl border p-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-base font-semibold">Invitations Data</h3>
					<p className="text-muted-foreground text-sm">
						Backup or restore your generated invitation links
					</p>
				</div>
				<InfoTooltip
					ariaLabel="More information about Invitations Data"
					content={
						<span>
							Exporting your invitations allows you to restore your active links on a new device, so
							you can continue managing and tracking them.
						</span>
					}
				/>
			</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<Button
					variant="outline"
					onClick={handleExport}
					className="h-12 w-full gap-2 rounded-lg"
					aria-label="Export invitations"
					disabled={invitations.length === 0}
				>
					<DownloadIcon className="h-4 w-4" />
					<span>Export JSON</span>
				</Button>

				<div className="flex flex-col gap-1.5">
					<Button
						variant="outline"
						onClick={handleImportClick}
						className="h-12 w-full gap-2 rounded-lg"
						aria-label="Import invitations"
					>
						<UploadIcon className="h-4 w-4" />
						<span>Import JSON</span>
					</Button>
					{importError && (
						<p className="text-destructive mt-1.5 text-sm font-medium" role="alert">
							{importError}
						</p>
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
