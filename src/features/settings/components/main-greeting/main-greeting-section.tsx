import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MAIN_GREETINGS, MAIN_GREETING_FONTS } from "@/constants/main-greeting";
import { getRandomPalette } from "@/helpers/color-palettes";
import { cn } from "@/lib/utils";
import { CUSTOM_GREETING_MAX_LENGTH } from "@/schema/validation-constants";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import type { GreetingTextColorType } from "@/types/settings";
import { ArrowRightLeftIcon, DicesIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RestoreDefaultsButton } from "../restore-defaults-button";

function DebouncedColorPicker({
	value,
	onChange,
	id,
}: {
	value: string;
	onChange: (val: string) => void;
	id?: string;
}) {
	const [localValue, setLocalValue] = useState(value);
	const onChangeRef = useRef(onChange);
	const localValueRef = useRef(localValue);
	const valueRef = useRef(value);

	useEffect(() => {
		onChangeRef.current = onChange;
		localValueRef.current = localValue;
		valueRef.current = value;
	}, [onChange, localValue, value]);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (localValue !== value) {
				onChange(localValue);
			}
		}, 50); // 50ms debounce
		return () => clearTimeout(timeout);
	}, [localValue, onChange, value]);

	// Flush dirty value on unmount
	useEffect(() => {
		return () => {
			if (localValueRef.current !== valueRef.current) {
				onChangeRef.current(localValueRef.current);
			}
		};
	}, []);

	return (
		<input
			type="color"
			value={localValue}
			onChange={(e) => setLocalValue(e.target.value)}
			onBlur={() => {
				if (localValue !== value) {
					onChange(localValue);
				}
			}}
			className="h-16 w-16 -translate-x-3 -translate-y-3 cursor-pointer"
			id={id}
			aria-label={id ? undefined : "Color picker"}
		/>
	);
}

export function MainGreetingSection() {
	const { settings, updateSettings } = useDayBookStore();
	const greetingSettings = settings.greetingTextSettings || defaultSettings.greetingTextSettings!;

	const handleReset = () => {
		updateSettings({ greetingTextSettings: defaultSettings.greetingTextSettings });
	};

	const updateGreeting = (updates: Partial<typeof greetingSettings>) => {
		const currentSettings = useDayBookStore.getState().settings;
		const currentGreetingSettings =
			currentSettings.greetingTextSettings || defaultSettings.greetingTextSettings!;
		updateSettings({
			greetingTextSettings: { ...currentGreetingSettings, ...updates },
		});
	};

	const updateGradient = (updates: Partial<typeof greetingSettings.gradient>) => {
		const currentSettings = useDayBookStore.getState().settings;
		const currentGreetingSettings =
			currentSettings.greetingTextSettings || defaultSettings.greetingTextSettings!;
		updateSettings({
			greetingTextSettings: {
				...currentGreetingSettings,
				gradient: { ...currentGreetingSettings.gradient, ...updates },
			},
		});
	};

	const isCustomText = !MAIN_GREETINGS.includes(greetingSettings.text);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-semibold">Live Preview</h3>
					<RestoreDefaultsButton onClick={handleReset} ariaLabel="Restore main greeting defaults" />
				</div>
				<div className="bg-card/50 flex min-h-37.5 w-full items-center justify-center rounded-xl border border-dashed p-6 text-center shadow-inner">
					<h1
						className={cn(
							"max-w-full px-4 pb-2 text-4xl leading-normal font-extrabold tracking-tight break-all md:text-5xl",
							greetingSettings.type === "gradient" ? "bg-clip-text text-transparent" : "",
						)}
						style={{
							...(greetingSettings.fontFamily ? { fontFamily: greetingSettings.fontFamily } : {}),
							...(greetingSettings.type === "gradient"
								? {
										backgroundImage: `linear-gradient(${
											greetingSettings.gradient.direction === "random"
												? "135deg" // Fixed for preview so it doesn't flicker on typing
												: greetingSettings.gradient.direction
										}, ${greetingSettings.gradient.start}, ${greetingSettings.gradient.end})`,
									}
								: { color: greetingSettings.solidColor }),
						}}
					>
						{greetingSettings.text || "Type something..."}
					</h1>
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<div className="flex flex-col gap-3">
					<Label className="text-base" htmlFor="greeting-text">
						Greeting Text
					</Label>
					<Select
						value={isCustomText ? "custom" : greetingSettings.text}
						onValueChange={(val) => {
							if (val !== "custom") updateGreeting({ text: val });
							else updateGreeting({ text: "" }); // Clear to let the user type
						}}
					>
						<SelectTrigger id="greeting-text" className="w-full">
							<SelectValue placeholder="Select a greeting" />
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

					{isCustomText && (
						<div className="flex flex-col gap-2">
							<Label htmlFor="custom-greeting-input" className="sr-only">
								Type your custom greeting
							</Label>
							<Input
								placeholder="Type your custom greeting"
								value={greetingSettings.text}
								onChange={(e) => updateGreeting({ text: e.target.value })}
								className="mt-2"
								maxLength={CUSTOM_GREETING_MAX_LENGTH}
								autoFocus
								id="custom-greeting-input"
								aria-label="Type your custom greeting"
								autoComplete="off"
							/>
						</div>
					)}
				</div>

				<div className="flex flex-col gap-3">
					<Label className="text-base" htmlFor="greeting-font">
						Font Style
					</Label>
					<Select
						value={greetingSettings.fontFamily || MAIN_GREETING_FONTS[0].value}
						onValueChange={(val) => updateGreeting({ fontFamily: val })}
					>
						<SelectTrigger id="greeting-font" className="w-full">
							<SelectValue placeholder="Select a font" />
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

				<div className="flex flex-col gap-3">
					<h3 className="text-base font-medium">Color Style</h3>
					<RadioGroup
						value={greetingSettings.type}
						onValueChange={(val: GreetingTextColorType) => updateGreeting({ type: val })}
						className="flex gap-4 pt-2"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="solid" id="solid" />
							<Label htmlFor="solid" className="font-normal">
								Solid Color
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="gradient" id="gradient" />
							<Label htmlFor="gradient" className="font-normal">
								Gradient
							</Label>
						</div>
					</RadioGroup>
				</div>

				<div className="flex flex-col gap-4 sm:col-span-2">
					<div className="flex items-center justify-between">
						<h3 className="text-base font-medium">Colors</h3>
						{greetingSettings.type === "gradient" && (
							<div className="flex items-center gap-1 sm:gap-2">
								<Button
									variant="ghost"
									size="sm"
									className="h-8 text-xs"
									aria-label="Reverse gradient colors"
									onClick={() => {
										updateGradient({
											start: greetingSettings.gradient.end,
											end: greetingSettings.gradient.start,
										});
									}}
								>
									<ArrowRightLeftIcon className="h-3 w-3 sm:mr-1.5" />
									<span className="hidden sm:inline">Reverse</span>
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 text-xs"
									aria-label="Randomize gradient colors"
									onClick={() => {
										// Pass the current colors to avoid getting the same palette if possible
										const currentStr = `${greetingSettings.gradient.start},${greetingSettings.gradient.end}`;
										const randomPalette = getRandomPalette(currentStr);
										// Use the first two colors from the random palette for the gradient
										updateGradient({
											start: randomPalette[0],
											end: randomPalette[1],
										});
									}}
								>
									<DicesIcon className="h-3 w-3 sm:mr-1.5" />
									<span className="hidden sm:inline">Randomize</span>
								</Button>
							</div>
						)}
					</div>
					{greetingSettings.type === "solid" ? (
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 overflow-hidden rounded-md border shadow-sm">
								<DebouncedColorPicker
									value={greetingSettings.solidColor}
									onChange={(val) => updateGreeting({ solidColor: val })}
								/>
							</div>
							<span className="text-muted-foreground text-sm uppercase">
								{greetingSettings.solidColor}
							</span>
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Label className="text-muted-foreground text-sm" htmlFor="start-color">
									Start Color
								</Label>
								<div className="flex items-center gap-3">
									<div className="h-10 w-10 overflow-hidden rounded-md border shadow-sm">
										<DebouncedColorPicker
											value={greetingSettings.gradient.start}
											onChange={(val) => updateGradient({ start: val })}
											id="start-color"
										/>
									</div>
									<span className="text-muted-foreground text-sm uppercase">
										{greetingSettings.gradient.start}
									</span>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<Label className="text-muted-foreground text-sm" htmlFor="end-color">
									End Color
								</Label>
								<div className="flex items-center gap-3">
									<div className="h-10 w-10 overflow-hidden rounded-md border shadow-sm">
										<DebouncedColorPicker
											value={greetingSettings.gradient.end}
											onChange={(val) => updateGradient({ end: val })}
											id="end-color"
										/>
									</div>
									<span className="text-muted-foreground text-sm uppercase">
										{greetingSettings.gradient.end}
									</span>
								</div>
							</div>
							<div className="mt-2 flex flex-col gap-2 sm:col-span-2">
								<Label className="text-muted-foreground text-sm" htmlFor="gradient-direction">
									Gradient Direction
								</Label>
								<Select
									value={greetingSettings.gradient.direction}
									onValueChange={(val) => updateGradient({ direction: val })}
								>
									<SelectTrigger className="w-full" id="gradient-direction">
										<SelectValue placeholder="Direction" />
									</SelectTrigger>
									<SelectContent position="popper">
										<SelectItem value="to right">To Right</SelectItem>
										<SelectItem value="to left">To Left</SelectItem>
										<SelectItem value="to bottom">To Bottom</SelectItem>
										<SelectItem value="to top">To Top</SelectItem>
										<SelectItem value="to bottom right">To Bottom Right</SelectItem>
										<SelectItem value="to bottom left">To Bottom Left</SelectItem>
										<SelectItem value="to top right">To Top Right</SelectItem>
										<SelectItem value="to top left">To Top Left</SelectItem>
										<SelectItem value="random">Randomize on Load</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
