import { PartyHat } from "@/components/icons/party-hat";
import { RestoreDefaultsButton } from "@/components/restore-defaults-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MAIN_GREETINGS, MAIN_GREETING_FONTS } from "@/constants";
import { getRandomPalette } from "@/helpers";
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
				<PartyHat className="h-8 w-8 text-muted-foreground/30" />
				<p className="text-xs font-medium text-muted-foreground">No birthdays today</p>
				<p className="text-[10px] text-muted-foreground/70">
					Greeting customization will be available when someone is celebrating.
				</p>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-3 p-3 md:min-w-62.5">
			<div className="flex items-center justify-between">
				<h4 className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
					Greeting
				</h4>
				<div className="flex items-center gap-1">
					<RestoreDefaultsButton iconOnly onClick={restoreDefault} />
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6 rounded-full hover:bg-muted"
						onClick={randomizeColors}
						title="Randomize Colors"
						aria-label="Randomize colors"
					>
						<DicesIcon className="h-3.5 w-3.5 text-muted-foreground" />
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
							<SelectGroup>
								{MAIN_GREETINGS.map((text) => (
									<SelectItem key={text} value={text}>
										{text}
									</SelectItem>
								))}
								<SelectItem value="custom">Custom...</SelectItem>
							</SelectGroup>
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
							<SelectGroup>
								{MAIN_GREETING_FONTS.map((font) => (
									<SelectItem key={font.value} value={font.value}>
										<span style={{ fontFamily: font.value }}>{font.label}</span>
									</SelectItem>
								))}
							</SelectGroup>
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
						<SelectGroup>
							<SelectItem value="solid">Solid</SelectItem>
							<SelectItem value="gradient">Gradient</SelectItem>
						</SelectGroup>
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
