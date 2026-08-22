import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { RestoreDefaultsButton } from "./restore-defaults-button";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GREETINGS_MAX_LENGTH, GREETINGS_MIN_LENGTH } from "@/schema/validation-constants";

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

	const adjustTextareaHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
		const target = e.currentTarget;
		target.style.height = "auto";
		target.style.height = `${target.scrollHeight}px`;
		target.style.overflowY = target.scrollHeight > 128 ? "auto" : "hidden";
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-medium">Greetings</h3>
					<div className="flex gap-2">
						<RestoreDefaultsButton
							onClick={handleRestoreDefaults}
							ariaLabel="Restore default greetings"
						/>
						<Button
							variant="ghost"
							size="sm"
							className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 text-xs"
							onClick={handleClearAll}
							disabled={fields.length === 0}
							aria-label="Clear all greetings"
							title="Clear all greetings"
						>
							<Trash2Icon className="h-3 w-3 sm:mr-1.5" aria-hidden="true" />
							<span className="hidden sm:inline">Clear All</span>
						</Button>
					</div>
				</div>
				<p className="text-muted-foreground text-sm">
					Manage the birthday wishes that appear when you open a celebrant's special day.
				</p>
			</div>

			<div className="border-border bg-card flex flex-col divide-y overflow-hidden rounded-xl border">
				{fields.map((field, index) => (
					<div
						key={field.id}
						className="hover:bg-muted/30 flex flex-col gap-2 p-3 transition-colors"
					>
						<div className="flex items-start gap-3">
							<div className="flex flex-1 flex-col gap-1.5">
								<Textarea
									{...register(`greetings.${index}.text`)}
									placeholder="New greeting"
									minLength={GREETINGS_MIN_LENGTH}
									maxLength={GREETINGS_MAX_LENGTH}
									className="field-sizing-content max-h-32 min-h-0 w-full resize-none overflow-hidden border py-1.75 text-sm break-all transition-colors"
									onInput={adjustTextareaHeight}
									onFocus={adjustTextareaHeight}
									autoComplete="off"
								/>
								{errors.greetings?.[index]?.text && (
									<p className="text-destructive text-xs">
										{errors.greetings[index]?.text?.message}
									</p>
								)}
							</div>
							<Button
								size="icon"
								variant="ghost"
								className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 shrink-0 rounded-full"
								onClick={() => remove(index)}
								aria-label="Delete greeting"
								title="Delete greeting"
							>
								<Trash2Icon className="h-4 w-4" aria-hidden="true" />
							</Button>
						</div>
					</div>
				))}
				{fields.length === 0 && (
					<div className="text-muted-foreground p-6 text-center text-sm italic">
						No greetings added.
					</div>
				)}
			</div>

			<div className="flex flex-col gap-3 border-t pt-3">
				{fields.length < 10 ? (
					<Button
						onClick={handleAdd}
						className="w-fit"
						aria-label="Add new greeting"
						title="Add new greeting"
					>
						<PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
						Add Greeting
					</Button>
				) : (
					<p className="text-sm font-medium text-amber-600">Maximum of 10 greetings reached.</p>
				)}

				{errors.greetings?.root && (
					<p className="text-destructive text-sm font-medium" role="alert">
						{errors.greetings.root.message}
					</p>
				)}
			</div>
		</div>
	);
}
