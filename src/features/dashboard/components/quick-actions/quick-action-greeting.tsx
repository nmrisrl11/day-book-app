import { PartyHat } from "@/components/icons/party-hat";
import { RestoreDefaultsButton } from "@/components/restore-defaults-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MAIN_GREETINGS, MAIN_GREETING_FONTS } from "@/constants/main-greeting";
import { getRandomPalette } from "@/helpers/color-palettes";
import { CUSTOM_GREETING_MAX_LENGTH } from "@/schema/validation-constants";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import type { GreetingTextColorType } from "@/types/settings";
import { DicesIcon } from "lucide-react";

export function QuickActionGreeting({ hasCelebrants = true }: { hasCelebrants?: boolean }) {
	const { settings, updateSettings } = useDayBookStore();
	const greetingSettings = settings.greetingTextSettings || defaultSettings.greetingTextSettings!;

	const updateGreeting = (updates: Partial<typeof greetingSettings>) => {
		const currentSettings = useDayBookStore.getState().settings;
		const currentGreetingSettings =
			currentSettings.greetingTextSettings || defaultSettings.greetingTextSettings!;
		updateSettings({
			greetingTextSettings: { ...currentGreetingSettings, ...updates },
		});
	};

	const randomizeColors = () => {
		if (greetingSettings.type === "gradient") {
			const currentStr = `${greetingSettings.gradient.start},${greetingSettings.gradient.end}`;
			const randomPalette = getRandomPalette(currentStr);
			updateGreeting({
				gradient: {
					...greetingSettings.gradient,
					start: randomPalette[0],
					end: randomPalette[1],
				},
			});
		} else {
			const randomPalette = getRandomPalette(greetingSettings.solidColor);
			updateGreeting({ solidColor: randomPalette[0] });
		}
	};

	const restoreDefault = () => {
		updateSettings({ greetingTextSettings: defaultSettings.greetingTextSettings });
	};

	const isCustomText = !MAIN_GREETINGS.includes(greetingSettings.text);

	if (!hasCelebrants) {
		return (
			<div className="flex h-full min-h-35 w-full flex-col items-center justify-center gap-2 p-3 text-center md:min-w-62.5">
				<PartyHat className="text-muted-foreground/30 h-8 w-8" />
				<p className="text-muted-foreground text-xs font-medium">No birthdays today</p>
				<p className="text-muted-foreground/70 text-[10px]">
					Greeting customization will be available when someone is celebrating.
				</p>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-3 p-3 md:min-w-62.5">
			<div className="flex items-center justify-between">
				<h4 className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
					Greeting
				</h4>
				<div className="flex items-center gap-1">
					<RestoreDefaultsButton iconOnly onClick={restoreDefault} />
					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-muted h-6 w-6 rounded-full"
						onClick={randomizeColors}
						title="Randomize Colors"
						aria-label="Randomize colors"
					>
						<DicesIcon className="text-muted-foreground h-3.5 w-3.5" />
					</Button>
				</div>
			</div>

			<div className="flex w-full flex-col gap-2">
				<div className="grid grid-cols-2 gap-2 md:grid-cols-1">
					<Select
						value={isCustomText ? "custom" : greetingSettings.text}
						onValueChange={(val) => {
							if (val !== "custom") updateGreeting({ text: val });
							else updateGreeting({ text: "" });
						}}
					>
						<SelectTrigger className="h-8 w-full px-2.5 text-xs">
							<SelectValue placeholder="Select greeting" />
						</SelectTrigger>
						<SelectContent position="popper">
							{MAIN_GREETINGS.map((text) => (
								<SelectItem key={text} value={text}>
									{text}
								</SelectItem>
							))}
							<SelectItem value="custom">Custom...</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={greetingSettings.fontFamily || MAIN_GREETING_FONTS[0].value}
						onValueChange={(val) => updateGreeting({ fontFamily: val })}
					>
						<SelectTrigger className="h-8 w-full px-2.5 text-xs">
							<SelectValue placeholder="Font" />
						</SelectTrigger>
						<SelectContent position="popper">
							{MAIN_GREETING_FONTS.map((font) => (
								<SelectItem key={font.value} value={font.value}>
									<span style={{ fontFamily: font.value }}>{font.label}</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Select
					value={greetingSettings.type}
					onValueChange={(val: GreetingTextColorType) => updateGreeting({ type: val })}
				>
					<SelectTrigger className="h-8 w-full px-2.5 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectItem value="solid">Solid</SelectItem>
						<SelectItem value="gradient">Gradient</SelectItem>
					</SelectContent>
				</Select>

				{isCustomText && (
					<Input
						placeholder="Type your custom greeting"
						value={greetingSettings.text}
						onChange={(e) => updateGreeting({ text: e.target.value })}
						className="h-8 w-full text-xs"
						maxLength={CUSTOM_GREETING_MAX_LENGTH}
						autoFocus
						aria-label="Type your custom greeting"
						autoComplete="off"
					/>
				)}
			</div>
		</div>
	);
}
