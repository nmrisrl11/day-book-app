import { RestoreDefaultsButton } from "@/components/restore-defaults-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
	FLOATING_MESSAGE_MAX_LENGTH,
	FLOATING_MESSAGE_MIN_LENGTH,
} from "@/schema/validation-constants";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const floatingMessagesSchema = z.object({
	messages: z
		.array(
			z.object({
				text: z
					.string()
					.min(
						FLOATING_MESSAGE_MIN_LENGTH,
						`Must be at least ${FLOATING_MESSAGE_MIN_LENGTH} characters.`,
					)
					.max(
						FLOATING_MESSAGE_MAX_LENGTH,
						`Cannot exceed ${FLOATING_MESSAGE_MAX_LENGTH} characters.`,
					),
			}),
		)
		.max(10, "Maximum of 10 messages reached."),
});

type FloatingMessagesFormValues = z.infer<typeof floatingMessagesSchema>;

export function FloatingMessagesManager() {
	const { settings, updateSettings } = useDayBookStore();
	const initialMessages = settings.floatingMessages || [];

	const {
		register,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm<FloatingMessagesFormValues>({
		resolver: zodResolver(floatingMessagesSchema),
		defaultValues: {
			messages: initialMessages.map((text) => ({ text })),
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "messages",
	});

	useEffect(() => {
		const subscription = watch((value) => {
			if (value.messages) {
				const parsed = floatingMessagesSchema.safeParse(value);
				if (parsed.success) {
					const newMessages = parsed.data.messages.map((m) => m.text);
					const currentMessages = useDayBookStore.getState().settings.floatingMessages || [];
					if (JSON.stringify(newMessages) !== JSON.stringify(currentMessages)) {
						updateSettings({ floatingMessages: newMessages });
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
		reset({ messages: [] });
		updateSettings({ floatingMessages: [] });
	};

	const handleRestoreDefaults = () => {
		if (defaultSettings.floatingMessages) {
			const defaults = defaultSettings.floatingMessages.map((text) => ({ text }));
			reset({ messages: defaults });
			updateSettings({ floatingMessages: defaultSettings.floatingMessages });
		}
	};

	return (
		<div className="bg-card flex flex-col rounded-xl border">
			<div className="bg-muted/30 flex flex-col gap-1.5 rounded-t-xl border-b p-4">
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-base font-semibold">Floating Messages</h3>
					<div className="flex shrink-0 items-center gap-2">
						<RestoreDefaultsButton
							onClick={handleRestoreDefaults}
							ariaLabel="Restore default floating messages"
						/>
						<Button
							variant="ghost"
							size="sm"
							className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 text-xs"
							onClick={handleClearAll}
							disabled={fields.length === 0}
							aria-label="Clear all floating messages"
							title="Clear all floating messages"
						>
							<Trash2Icon className="h-3 w-3 sm:mr-1.5" aria-hidden="true" />
							<span className="hidden sm:inline">Clear All</span>
						</Button>
					</div>
				</div>
				<p className="text-muted-foreground max-w-[85%] text-sm">
					Manage the messages that float across the screen when someone has a birthday. <br />(
					<span className="font-bold">Tip:</span> You can use emojis with your system keyboard:{" "}
					<Kbd>Win + .</Kbd> or <Kbd>Cmd + Ctrl + Space</Kbd>)
				</p>
			</div>

			<div className="flex flex-col gap-4 p-4">
				<div className="bg-muted/30 min-h-32 content-center rounded-xl border border-dashed p-4">
					<div className="flex flex-wrap gap-2">
						{fields.map((field, index) => (
							<div key={field.id} className="flex flex-col gap-1">
								<div className="relative">
									<Input
										{...register(`messages.${index}.text`)}
										className="bg-background peer field-sizing-content h-9 rounded-full pe-9 text-xs shadow-sm"
										placeholder="Enter a message"
										minLength={FLOATING_MESSAGE_MIN_LENGTH}
										maxLength={FLOATING_MESSAGE_MAX_LENGTH}
										autoComplete="off"
									/>
									<Button
										size="icon"
										variant="ghost"
										className="hover:bg-destructive/20 hover:text-destructive absolute inset-y-0 inset-e-1 my-auto h-7 w-7 rounded-full"
										onClick={() => remove(index)}
										aria-label="Delete message"
										title="Delete message"
									>
										<Trash2Icon aria-hidden="true" className="h-3 w-3" />
									</Button>
								</div>
								{errors.messages?.[index]?.text && (
									<span className="text-destructive max-w-55 pl-2 text-[10px]">
										{errors.messages[index]?.text?.message}
									</span>
								)}
							</div>
						))}
						{fields.length === 0 && (
							<div className="text-muted-foreground w-full py-4 text-center text-sm italic">
								No floating messages added.
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-3">
					{fields.length < 10 ? (
						<div className="flex flex-col gap-3">
							<Button
								onClick={handleAdd}
								size="sm"
								className="w-fit"
								aria-label="Add floating message"
								title="Add floating message"
							>
								<PlusIcon className="mr-1 h-4 w-4" aria-hidden="true" />
								Add New Message
							</Button>
						</div>
					) : (
						<p className="text-sm font-medium text-amber-600">Maximum of 10 messages reached.</p>
					)}

					{errors.messages?.root && (
						<p className="text-destructive text-sm font-medium" role="alert">
							{errors.messages.root.message}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
