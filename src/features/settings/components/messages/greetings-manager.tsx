import { RestoreDefaultsButton } from "@/components/restore-defaults-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { GREETINGS_MAX_LENGTH, GREETINGS_MIN_LENGTH } from "@/schema/validation-constants";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const greetingSchema = z.object({
	greetings: z
		.array(
			z.object({
				text: z
					.string()
					.min(GREETINGS_MIN_LENGTH, `Must be at least ${GREETINGS_MIN_LENGTH} characters.`)
					.max(GREETINGS_MAX_LENGTH, `Cannot exceed ${GREETINGS_MAX_LENGTH} characters.`),
			}),
		)
		.max(10, "Maximum of 10 greetings reached."),
});

type GreetingFormValues = z.infer<typeof greetingSchema>;

export function GreetingsManager() {
	const { settings, updateSettings } = useDayBookStore();
	const initialGreetings = settings.greetings || [];

	const {
		register,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm<GreetingFormValues>({
		resolver: zodResolver(greetingSchema),
		defaultValues: {
			greetings: initialGreetings.map((text) => ({ text })),
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "greetings",
	});

	useEffect(() => {
		const subscription = watch((value) => {
			if (value.greetings) {
				const parsed = greetingSchema.safeParse(value);
				if (parsed.success) {
					const newGreetings = parsed.data.greetings.map((g) => g.text);
					const currentGreetings = useDayBookStore.getState().settings.greetings || [];
					if (JSON.stringify(newGreetings) !== JSON.stringify(currentGreetings)) {
						updateSettings({ greetings: newGreetings });
					}
				}
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, updateSettings]);

	const handleAdd = () => {
		if (fields.length < 10) {
			append({ text: "" });
		}
	};

	const handleClearAll = () => {
		reset({ greetings: [] });
		updateSettings({ greetings: [] });
	};

	const handleRestoreDefaults = () => {
		if (defaultSettings.greetings) {
			const defaults = defaultSettings.greetings.map((text) => ({ text }));
			reset({ greetings: defaults });
			updateSettings({ greetings: defaultSettings.greetings });
		}
	};

	const handleToggleCustomGreetings = (checked: boolean) => {
		updateSettings({ customGreetingsEnabled: checked });
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="bg-card flex flex-col rounded-xl border">
				<div className="bg-muted/30 rounded-t-xl border-b p-4">
					<h3 className="text-base font-semibold">Greetings Settings</h3>
					<p className="text-muted-foreground text-sm">
						Manage how greetings are generated for birthdays.
					</p>
				</div>
				<div className="flex flex-col px-4">
					<div className="flex flex-col gap-1 py-4">
						<div className="flex items-center justify-between gap-4">
							<Label className="text-sm font-semibold" htmlFor="enable-custom-greetings">
								Use Custom Greetings
							</Label>
							<div className="flex shrink-0 items-center">
								<Switch
									id="enable-custom-greetings"
									checked={settings.customGreetingsEnabled}
									onCheckedChange={handleToggleCustomGreetings}
								/>
							</div>
						</div>
						<p className="text-muted-foreground max-w-[85%] text-sm">
							Enable to use your own custom greetings instead of the default ones.
						</p>
					</div>
				</div>
			</div>

			{settings.customGreetingsEnabled && (
				<div className="bg-card flex flex-col rounded-xl border">
					<div className="bg-muted/30 flex flex-col gap-1.5 rounded-t-xl border-b p-4">
						<div className="flex items-center justify-between gap-4">
							<h3 className="text-base font-semibold">Custom Greetings</h3>
							<div className="flex shrink-0 items-center gap-2">
								<RestoreDefaultsButton
									onClick={handleRestoreDefaults}
									ariaLabel="Restore default custom greetings"
								/>
								<Button
									variant="ghost"
									size="sm"
									className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 text-xs"
									onClick={handleClearAll}
									disabled={fields.length === 0}
									aria-label="Clear all custom greetings"
									title="Clear all custom greetings"
								>
									<Trash2Icon className="h-3 w-3 sm:mr-1.5" aria-hidden="true" />
									<span className="hidden sm:inline">Clear All</span>
								</Button>
							</div>
						</div>
						<p className="text-muted-foreground max-w-[85%] text-sm">
							Manage the specific messages available when generating a greeting.
						</p>
					</div>

					<div className="flex flex-col gap-4 p-4">
						<div className="bg-muted/30 min-h-32 content-center rounded-xl border border-dashed p-4">
							<div className="flex flex-col gap-2">
								{fields.map((field, index) => (
									<div key={field.id} className="flex flex-col gap-1">
										<div className="relative">
											<Textarea
												{...register(`greetings.${index}.text`)}
												className="bg-background field-sizing-content min-h-15 resize-none rounded-lg pr-9 text-xs shadow-sm max-md:tracking-wide"
												placeholder="Enter a greeting message"
												minLength={GREETINGS_MIN_LENGTH}
												maxLength={GREETINGS_MAX_LENGTH}
											/>
											<Button
												size="icon"
												variant="ghost"
												className="hover:bg-destructive/20 hover:text-destructive absolute top-2 right-2 h-7 w-7 rounded-full"
												onClick={() => remove(index)}
												aria-label="Delete greeting"
												title="Delete greeting"
											>
												<Trash2Icon aria-hidden="true" className="h-3 w-3" />
											</Button>
										</div>
										{errors.greetings?.[index]?.text && (
											<span className="text-destructive pl-2 text-xs">
												{errors.greetings[index]?.text?.message}
											</span>
										)}
									</div>
								))}
								{fields.length === 0 && (
									<div className="text-muted-foreground w-full py-8 text-center text-sm italic">
										No custom greetings added.
									</div>
								)}
							</div>
						</div>

						<div className="flex flex-col gap-3">
							{fields.length < 50 ? (
								<div className="flex flex-col gap-3">
									<Button
										onClick={handleAdd}
										size="sm"
										className="w-fit"
										aria-label="Add custom greeting"
										title="Add custom greeting"
									>
										<PlusIcon className="mr-1 h-4 w-4" aria-hidden="true" />
										Add New Greeting
									</Button>
								</div>
							) : (
								<p className="text-sm font-medium text-amber-600">
									Maximum of 50 greetings reached.
								</p>
							)}

							{errors.greetings?.root && (
								<p className="text-destructive text-sm font-medium" role="alert">
									{errors.greetings.root.message}
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
