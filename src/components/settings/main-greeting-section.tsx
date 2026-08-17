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
import { MAIN_GREETINGS } from "@/constants/main-greeting";
import { cn } from "@/lib/utils";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import type { GreetingTextColorType } from "@/types/settings";
import { RestoreDefaultsButton } from "./restore-defaults-button";

export function MainGreetingSection() {
	const { settings, updateSettings } = useDayBookStore();
	const greetingSettings = settings.greetingTextSettings || defaultSettings.greetingTextSettings!;

	const handleReset = () => {
		updateSettings({ greetingTextSettings: defaultSettings.greetingTextSettings });
	};

	const updateGreeting = (updates: Partial<typeof greetingSettings>) => {
		updateSettings({
			greetingTextSettings: { ...greetingSettings, ...updates },
		});
	};

	const updateGradient = (updates: Partial<typeof greetingSettings.gradient>) => {
		updateGreeting({
			gradient: { ...greetingSettings.gradient, ...updates },
		});
	};

	const isCustomText = !MAIN_GREETINGS.includes(greetingSettings.text);

	return (
		<div className="flex flex-col gap-8">
			{/* Preview */}
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
						style={
							greetingSettings.type === "gradient"
								? {
										backgroundImage: `linear-gradient(${
											greetingSettings.gradient.direction === "random"
												? "135deg" // Fixed for preview so it doesn't flicker on typing
												: greetingSettings.gradient.direction
										}, ${greetingSettings.gradient.start}, ${greetingSettings.gradient.end})`,
									}
								: { color: greetingSettings.solidColor }
						}
					>
						{greetingSettings.text || "Type something..."}
					</h1>
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				{/* Text Selection */}
				<div className="flex flex-col gap-3">
					<Label className="text-base" htmlFor="greeting-text">
						Greeting Text
					</Label>
					<Select
						value={isCustomText ? "custom" : greetingSettings.text}
						onValueChange={(val) => {
							if (val !== "custom") updateGreeting({ text: val });
							else updateGreeting({ text: "" }); // Clear to let them type
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
						<Input
							placeholder="Type your custom greeting"
							value={greetingSettings.text}
							onChange={(e) => updateGreeting({ text: e.target.value })}
							className="mt-2"
							maxLength={50}
							autoFocus
							id="custom-greeting-input"
						/>
					)}
				</div>

				{/* Style Type */}
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

				{/* Color Controls */}
				<div className="flex flex-col gap-4 sm:col-span-2">
					<h3 className="text-base font-medium">Colors</h3>
					{greetingSettings.type === "solid" ? (
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 overflow-hidden rounded-md border shadow-sm">
								<input
									type="color"
									value={greetingSettings.solidColor}
									onChange={(e) => updateGreeting({ solidColor: e.target.value })}
									className="h-16 w-16 -translate-x-3 -translate-y-3 cursor-pointer"
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
										<input
											type="color"
											value={greetingSettings.gradient.start}
											onChange={(e) => updateGradient({ start: e.target.value })}
											className="h-16 w-16 -translate-x-3 -translate-y-3 cursor-pointer"
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
										<input
											type="color"
											value={greetingSettings.gradient.end}
											onChange={(e) => updateGradient({ end: e.target.value })}
											className="h-16 w-16 -translate-x-3 -translate-y-3 cursor-pointer"
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
