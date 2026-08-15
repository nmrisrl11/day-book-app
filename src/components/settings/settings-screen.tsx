import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDayBook } from "@/context/day-book-context";
import { exportBirthdays, parseImportedBirthdays } from "@/helpers/import-export";
import { DownloadIcon, UploadIcon, MoonIcon, SunIcon, ArrowLeft } from "lucide-react";
import { DeleteConfirmationModal } from "../management/delete-confirmation-modal";
import { useNavigate } from "react-router-dom";
import { FloatingMessagesManager } from "./floating-messages-manager";
import { GreetingsManager } from "./greetings-manager";

export function SettingsScreen() {
	const { settings, updateSettings, birthdays, importData, deleteAllBirthdays } = useDayBook();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [importError, setImportError] = useState("");
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const navigate = useNavigate();

	const handleConfirmDeleteAll = () => {
		deleteAllBirthdays();
		setDeleteModalOpen(false);
	};

	const handleUpcomingCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.valueAsNumber;
		if (Number.isInteger(val) && val >= 1 && val <= 10) {
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
		} catch (err) {
			setImportError(err instanceof Error ? err.message : "Failed to import data.");
		} finally {
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const canImport = birthdays.length === 0;

	return (
		<div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-2xl flex-col gap-6 pb-12 duration-500">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate(-1)}
					className="shrink-0"
					aria-label="Go back"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
					<p className="text-muted-foreground">Manage your preferences and data.</p>
				</div>
			</div>

			<div className="border-border bg-card flex flex-col gap-8 rounded-xl border p-6 shadow-sm">
				{/* Theme Section */}
				<div className="flex flex-col gap-3">
					<h3 className="text-base font-medium">Theme</h3>
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
						name="upcoming-count"
						type="number"
						min={1}
						max={10}
						step="1"
						value={settings.upcomingCount}
						onChange={handleUpcomingCountChange}
					/>
				</div>

				<FloatingMessagesManager />

				<GreetingsManager />

				{/* Data Management Section */}
				<div className="flex flex-col gap-3">
					<h3 className="text-base font-medium">Data Management</h3>
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
						<Input
							id="import-file"
							name="import-file"
							type="file"
							accept=".json,application/json"
							className="hidden"
							ref={fileInputRef}
							onChange={handleFileChange}
							aria-label="Import Birthdays"
						/>
					</div>
				</div>

				{/* Danger Zone Section */}
				{birthdays.length > 0 && (
					<div className="border-destructive/20 bg-destructive/5 flex flex-col gap-3 rounded-xl border p-4">
						<div className="flex flex-col gap-1">
							<h3 className="text-destructive text-base font-bold">Danger Zone</h3>
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

			<DeleteConfirmationModal
				open={deleteModalOpen}
				onOpenChange={setDeleteModalOpen}
				onConfirm={handleConfirmDeleteAll}
				isDeleteAll={true}
			/>
		</div>
	);
}
