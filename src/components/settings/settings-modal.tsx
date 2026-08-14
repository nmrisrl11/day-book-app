import { useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDayBook } from "@/context/day-book-context";
import { exportBirthdays, parseImportedBirthdays } from "@/helpers/import-export";
import { DownloadIcon, UploadIcon, MoonIcon, SunIcon } from "lucide-react";
import { DeleteConfirmationModal } from "../management/delete-confirmation-modal";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SettingsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
	const { settings, updateSettings, birthdays, importData, deleteAllBirthdays } = useDayBook();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [importError, setImportError] = useState("");
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const handleConfirmDeleteAll = () => {
		deleteAllBirthdays();
		setDeleteModalOpen(false);
		onOpenChange(false); // Close settings modal too? Optional, but good UX.
	};

	const handleUpcomingCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = parseInt(e.target.value, 10);
		if (!isNaN(val) && val >= 1 && val <= 10) {
			updateSettings({ upcomingCount: val });
		}
	};

	const handleExport = () => {
		exportBirthdays(birthdays);
	};

	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setImportError("");
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const importedBirthdays = parseImportedBirthdays(text);
			importData(importedBirthdays);
			// Close modal on success
			onOpenChange(false);
		} catch (err) {
			setImportError(err instanceof Error ? err.message : "Failed to import data.");
		} finally {
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	// Determine if import is allowed (only once if no birthdays exist, per user instruction)
	const canImport = birthdays.length === 0;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Manage your preferences and data.</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[60vh] pr-4">
					<div className="flex flex-col gap-8 py-4">
						{/* Theme Section */}
						<div className="flex flex-col gap-3">
							<Label className="text-base">Theme</Label>
							<div className="flex gap-2">
								<Button
									variant={settings.theme === "light" ? "default" : "outline"}
									onClick={() => updateSettings({ theme: "light" })}
									className="flex-1"
								>
									<SunIcon className="mr-2 h-4 w-4" />
									Light
								</Button>
								<Button
									variant={settings.theme === "dark" ? "default" : "outline"}
									onClick={() => updateSettings({ theme: "dark" })}
									className="flex-1"
								>
									<MoonIcon className="mr-2 h-4 w-4" />
									Dark
								</Button>
							</div>
						</div>

						{/* Display Settings Section */}
						<div className="flex flex-col gap-3">
							<Label htmlFor="upcoming-count" className="text-base">
								Upcoming Birthdays Display Count
							</Label>
							<p className="text-muted-foreground text-sm">
								Choose how many upcoming birthdays to show on the dashboard.
							</p>
							<Input
								id="upcoming-count"
								type="number"
								min={1}
								max={10}
								value={settings.upcomingCount}
								onChange={handleUpcomingCountChange}
							/>
						</div>

						{/* Data Management Section */}
						<div className="flex flex-col gap-3">
							<Label className="text-base">Data Management</Label>
							<div className="flex flex-col gap-2">
								<Button variant="outline" onClick={handleExport} className="w-full justify-start">
									<DownloadIcon className="mr-2 h-4 w-4" />
									Export Birthdays (JSON)
								</Button>

								<div className="flex flex-col gap-1">
									<Button
										variant="outline"
										onClick={handleImportClick}
										className="w-full justify-start"
										disabled={!canImport}
									>
										<UploadIcon className="mr-2 h-4 w-4" />
										Import Birthdays (JSON)
									</Button>
									{!canImport && (
										<p className="text-muted-foreground mt-1 text-xs">
											Import is only available when you have no saved birthdays.
										</p>
									)}
									{importError && (
										<p className="text-destructive mt-1 text-sm font-medium">{importError}</p>
									)}
								</div>
								{/* Hidden file input styled indirectly */}
								<Input
									type="file"
									accept=".json,application/json"
									className="hidden"
									ref={fileInputRef}
									onChange={handleFileChange}
								/>
							</div>
						</div>

						{/* Danger Zone Section */}
						{birthdays.length > 0 && (
							<div className="border-destructive/20 bg-destructive/5 flex flex-col gap-3 rounded-xl border p-4">
								<div className="flex flex-col gap-1">
									<Label className="text-destructive text-base font-bold">Danger Zone</Label>
									<p className="text-muted-foreground text-sm">
										Permanently remove all birthdays. This action cannot be undone.
									</p>
								</div>
								<Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>
									Delete All Birthdays
								</Button>
							</div>
						)}
					</div>
				</ScrollArea>
			</DialogContent>

			<DeleteConfirmationModal
				open={deleteModalOpen}
				onOpenChange={setDeleteModalOpen}
				onConfirm={handleConfirmDeleteAll}
				isDeleteAll={true}
			/>
		</Dialog>
	);
}
