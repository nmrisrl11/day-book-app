import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Settings } from "@/types/settings";
import { ArrowRightIcon } from "lucide-react";
import { useMemo } from "react";

interface SettingsImportPreviewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentSettings: Settings;
	importedSettings: Partial<Settings>;
	onConfirm: () => void;
}

interface SettingChange {
	id: string;
	label: string;
	currentValue: string;
	importedValue: string;
	hasChanged: boolean;
}

interface SettingCategory {
	name: string;
	changes: SettingChange[];
}

export function SettingsImportPreviewDialog({
	open,
	onOpenChange,
	currentSettings,
	importedSettings,
	onConfirm,
}: SettingsImportPreviewDialogProps) {
	// 1. Generate the comparison data
	const categories = useMemo(() => {
		const cats: SettingCategory[] = [];

		const addCategory = (name: string, changes: SettingChange[]) => {
			// Only add category if it has valid settings being imported
			if (changes.length > 0) {
				cats.push({ name, changes });
			}
		};

		// Helper to format values for display
		const formatBool = (val: boolean | undefined) => (val ? "Enabled" : "Disabled");
		const formatVal = (val: unknown) => (val === undefined ? "Default" : String(val));

		// Appearance
		const appearanceChanges: SettingChange[] = [];
		if (importedSettings.theme !== undefined) {
			appearanceChanges.push({
				id: "theme",
				label: "Theme",
				currentValue: currentSettings.theme === "dark" ? "Dark" : "Light",
				importedValue: importedSettings.theme === "dark" ? "Dark" : "Light",
				hasChanged: currentSettings.theme !== importedSettings.theme,
			});
		}
		if (importedSettings.upcomingCount !== undefined) {
			appearanceChanges.push({
				id: "upcomingCount",
				label: "Upcoming Birthdays Count",
				currentValue: String(currentSettings.upcomingCount),
				importedValue: String(importedSettings.upcomingCount),
				hasChanged: currentSettings.upcomingCount !== importedSettings.upcomingCount,
			});
		}
		if (importedSettings.animationsEnabled !== undefined) {
			appearanceChanges.push({
				id: "animationsEnabled",
				label: "UI Animations",
				currentValue: formatBool(currentSettings.animationsEnabled),
				importedValue: formatBool(importedSettings.animationsEnabled),
				hasChanged: currentSettings.animationsEnabled !== importedSettings.animationsEnabled,
			});
		}
		if (importedSettings.quickActionsEnabled !== undefined) {
			appearanceChanges.push({
				id: "quickActionsEnabled",
				label: "Quick Actions",
				currentValue: formatBool(currentSettings.quickActionsEnabled),
				importedValue: formatBool(importedSettings.quickActionsEnabled),
				hasChanged: currentSettings.quickActionsEnabled !== importedSettings.quickActionsEnabled,
			});
		}
		if (importedSettings.quickActionsPosition !== undefined) {
			appearanceChanges.push({
				id: "quickActionsPosition",
				label: "Quick Actions Position",
				currentValue: formatVal(currentSettings.quickActionsPosition),
				importedValue: formatVal(importedSettings.quickActionsPosition),
				hasChanged: currentSettings.quickActionsPosition !== importedSettings.quickActionsPosition,
			});
		}
		addCategory("Appearance", appearanceChanges);

		// Avatar Settings
		const avatarChanges: SettingChange[] = [];
		if (importedSettings.avatarSettings !== undefined) {
			const curr = currentSettings.avatarSettings;
			const imp = importedSettings.avatarSettings;

			if (imp.allowCustomUploads !== undefined) {
				avatarChanges.push({
					id: "allowCustomUploads",
					label: "Custom Photo Uploads",
					currentValue: formatBool(curr?.allowCustomUploads),
					importedValue: formatBool(imp.allowCustomUploads),
					hasChanged: curr?.allowCustomUploads !== imp.allowCustomUploads,
				});
			}
			if (imp.defaultLibrary !== undefined) {
				avatarChanges.push({
					id: "defaultLibrary",
					label: "Default Avatar Library",
					currentValue: curr?.defaultLibrary === "boring-avatars" ? "Boring Avatars" : "Avvvatars",
					importedValue: imp.defaultLibrary === "boring-avatars" ? "Boring Avatars" : "Avvvatars",
					hasChanged: curr?.defaultLibrary !== imp.defaultLibrary,
				});
			}
			if (imp.avvvatarsStyle !== undefined) {
				avatarChanges.push({
					id: "avvvatarsStyle",
					label: "Avvvatars Style",
					currentValue: curr?.avvvatarsStyle === "shape" ? "Shape" : "Character",
					importedValue: imp.avvvatarsStyle === "shape" ? "Shape" : "Character",
					hasChanged: curr?.avvvatarsStyle !== imp.avvvatarsStyle,
				});
			}
			if (imp.boringAvatarsVariant !== undefined) {
				avatarChanges.push({
					id: "boringAvatarsVariant",
					label: "Boring Avatars Variant",
					currentValue: curr?.boringAvatarsVariant || "Marble",
					importedValue: imp.boringAvatarsVariant,
					hasChanged: curr?.boringAvatarsVariant !== imp.boringAvatarsVariant,
				});
			}
			if (imp.boringAvatarsColors !== undefined) {
				avatarChanges.push({
					id: "boringAvatarsColors",
					label: "Boring Avatars Colors",
					currentValue: `${curr?.boringAvatarsColors?.length || 0} colors`,
					importedValue: `${imp.boringAvatarsColors.length} colors`,
					hasChanged:
						JSON.stringify(curr?.boringAvatarsColors) !== JSON.stringify(imp.boringAvatarsColors),
				});
			}
		}
		addCategory("Avatar", avatarChanges);

		// Main Greeting
		const mainGreetingChanges: SettingChange[] = [];
		if (importedSettings.greetingTextSettings !== undefined) {
			const curr = currentSettings.greetingTextSettings;
			const imp = importedSettings.greetingTextSettings;

			if (imp.text !== undefined) {
				mainGreetingChanges.push({
					id: "greetingText",
					label: "Greeting Text",
					currentValue: curr?.text || "Default",
					importedValue: imp.text,
					hasChanged: curr?.text !== imp.text,
				});
			}
			if (imp.fontFamily !== undefined) {
				mainGreetingChanges.push({
					id: "greetingFont",
					label: "Font Family",
					currentValue: curr?.fontFamily || "Default",
					importedValue: imp.fontFamily,
					hasChanged: curr?.fontFamily !== imp.fontFamily,
				});
			}
			if (imp.type !== undefined) {
				mainGreetingChanges.push({
					id: "greetingType",
					label: "Text Style Type",
					currentValue: curr?.type === "gradient" ? "Gradient" : "Solid",
					importedValue: imp.type === "gradient" ? "Gradient" : "Solid",
					hasChanged: curr?.type !== imp.type,
				});
			}
			if (imp.type === "solid" && imp.solidColor !== undefined) {
				mainGreetingChanges.push({
					id: "greetingColor",
					label: "Solid Color",
					currentValue: curr?.solidColor || "#000000",
					importedValue: imp.solidColor,
					hasChanged: curr?.solidColor !== imp.solidColor,
				});
			}
			if (imp.type === "gradient" && imp.gradient !== undefined) {
				mainGreetingChanges.push({
					id: "greetingGradient",
					label: "Gradient Style",
					currentValue: `${curr?.gradient.start || ""} to ${curr?.gradient.end || ""} (${curr?.gradient.direction || ""})`,
					importedValue: `${imp.gradient.start} to ${imp.gradient.end} (${imp.gradient.direction})`,
					hasChanged: JSON.stringify(curr?.gradient) !== JSON.stringify(imp.gradient),
				});
			}
		}
		addCategory("Main Greeting", mainGreetingChanges);

		// Messages & Greetings
		const messageChanges: SettingChange[] = [];
		if (importedSettings.floatingMessages !== undefined) {
			const currentMessagesCount = currentSettings.floatingMessages?.length || 0;
			const importedMessagesCount = importedSettings.floatingMessages.length;
			messageChanges.push({
				id: "floatingMessages",
				label: "Floating Messages List",
				currentValue: `${currentMessagesCount} item${currentMessagesCount !== 1 ? "s" : ""}`,
				importedValue: `${importedMessagesCount} item${importedMessagesCount !== 1 ? "s" : ""}`,
				hasChanged:
					JSON.stringify(currentSettings.floatingMessages) !==
					JSON.stringify(importedSettings.floatingMessages),
			});
		}
		if (importedSettings.customGreetingsEnabled !== undefined) {
			messageChanges.push({
				id: "customGreetingsEnabled",
				label: "Custom Greetings",
				currentValue: formatBool(currentSettings.customGreetingsEnabled),
				importedValue: formatBool(importedSettings.customGreetingsEnabled),
				hasChanged:
					currentSettings.customGreetingsEnabled !== importedSettings.customGreetingsEnabled,
			});
		}
		if (importedSettings.greetings !== undefined) {
			const currentGreetingsCount = currentSettings.greetings?.length || 0;
			const importedGreetingsCount = importedSettings.greetings.length;
			messageChanges.push({
				id: "greetings",
				label: "Custom Greetings List",
				currentValue: `${currentGreetingsCount} item${currentGreetingsCount !== 1 ? "s" : ""}`,
				importedValue: `${importedGreetingsCount} item${importedGreetingsCount !== 1 ? "s" : ""}`,
				hasChanged:
					JSON.stringify(currentSettings.greetings) !== JSON.stringify(importedSettings.greetings),
			});
		}
		addCategory("Messages & Greetings", messageChanges);

		// Sound Settings
		const soundChanges: SettingChange[] = [];
		if (importedSettings.soundSettings !== undefined) {
			const curr = currentSettings.soundSettings;
			const imp = importedSettings.soundSettings;

			if (imp.enabled !== undefined) {
				soundChanges.push({
					id: "soundEnabled",
					label: "Sound Effects",
					currentValue: formatBool(curr?.enabled),
					importedValue: formatBool(imp.enabled),
					hasChanged: curr?.enabled !== imp.enabled,
				});
			}
			if (imp.volume !== undefined) {
				soundChanges.push({
					id: "soundVolume",
					label: "Volume",
					currentValue: `${Math.round((curr?.volume ?? 0.5) * 100)}%`,
					importedValue: `${Math.round(imp.volume * 100)}%`,
					hasChanged: curr?.volume !== imp.volume,
				});
			}
			if (imp.mappings !== undefined) {
				soundChanges.push({
					id: "soundMappings",
					label: "Sound Mappings",
					currentValue: curr?.mappings ? "Customized" : "Default",
					importedValue: "Customized",
					hasChanged: JSON.stringify(curr?.mappings) !== JSON.stringify(imp.mappings),
				});
			}
		}

		addCategory("Sound & Feedback", soundChanges);

		return cats;
	}, [currentSettings, importedSettings]);

	const allChanges = useMemo(() => categories.flatMap((c) => c.changes), [categories]);
	const changedSettings = allChanges.filter((c) => c.hasChanged);
	const unchangedSettings = allChanges.filter((c) => !c.hasChanged);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-border/50 bg-background flex max-h-[90vh] flex-col overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md">
				<div className="shrink-0 p-6 pb-4">
					<DialogHeader>
						<DialogTitle className="text-foreground font-sans text-2xl font-bold tracking-wide">
							Import Settings
						</DialogTitle>
						<DialogDescription className="text-muted-foreground mt-1">
							Review settings before syncing.
						</DialogDescription>
					</DialogHeader>

					<div className="bg-muted/50 mt-4 flex flex-col gap-1.5 rounded-lg p-3 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground font-medium">Settings detected</span>
							<span className="font-semibold">{allChanges.length}</span>
						</div>
						<div className="text-primary flex items-center justify-between">
							<span className="font-medium">Will be updated</span>
							<span className="font-bold">{changedSettings.length}</span>
						</div>
						<div className="text-muted-foreground flex items-center justify-between">
							<span>Already up to date</span>
							<span>{unchangedSettings.length}</span>
						</div>
					</div>
				</div>

				<div className="relative flex-1 overflow-hidden">
					<div
						className="custom-scrollbar h-full overflow-y-auto px-6 pb-2"
						style={{ maxHeight: "50vh" }}
					>
						{changedSettings.length > 0 && (
							<div className="mb-6">
								<h3 className="text-muted-foreground mb-3 border-b pb-1 text-sm font-semibold tracking-wider uppercase">
									Changes to import
								</h3>
								<div className="flex flex-col gap-5">
									{categories.map((category) => {
										const catChanges = category.changes.filter((c) => c.hasChanged);
										if (catChanges.length === 0) return null;

										return (
											<div key={category.name} className="flex flex-col gap-2">
												<h4 className="text-foreground text-xs font-semibold">{category.name}</h4>
												<div className="flex flex-col gap-2">
													{catChanges.map((change) => (
														<div
															key={change.id}
															className="bg-primary/5 border-primary/10 flex items-center justify-between gap-2 rounded-md border p-2"
														>
															<span
																className="truncate text-sm font-medium sm:whitespace-normal"
																title={change.label}
															>
																{change.label}
															</span>
															<div className="flex shrink-0 items-center gap-1.5 text-xs">
																<span
																	className="text-muted-foreground max-w-20 truncate text-right sm:max-w-25"
																	title={change.currentValue}
																>
																	{change.currentValue}
																</span>
																<ArrowRightIcon className="text-primary h-3.5 w-3.5 shrink-0" />
																<span
																	className="text-primary max-w-20 truncate text-right font-semibold sm:max-w-25"
																	title={change.importedValue}
																>
																	{change.importedValue}
																</span>
															</div>
														</div>
													))}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{unchangedSettings.length > 0 && (
							<div className="mb-4">
								<h3 className="text-muted-foreground mb-2 border-b pb-1 text-xs font-semibold tracking-wider uppercase">
									Already up to date
								</h3>
								<div className="text-muted-foreground/80 pl-1 text-sm">
									{unchangedSettings.length} setting{unchangedSettings.length === 1 ? "" : "s"}{" "}
									match perfectly.
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="border-border/50 bg-background shrink-0 border-t p-6 pt-4">
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							onConfirm();
							onOpenChange(false);
						}}
						disabled={changedSettings.length === 0}
					>
						Import Settings
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
