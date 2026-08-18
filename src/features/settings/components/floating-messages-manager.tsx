import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { defaultSettings, useDayBookStore } from "@/store/day-book-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { RestoreDefaultsButton } from "./restore-defaults-button";

const floatingMessagesSchema = z.object({
	messages: z
		.array(
			z.object({
				text: z
					.string()
					.min(2, "Must be at least 2 characters.")
					.max(50, "Cannot exceed 50 characters."),
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
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-medium">Floating Messages</h3>
					<div className="flex gap-2">
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
						>
							<Trash2Icon className="h-3 w-3 sm:mr-1.5" />
							<span className="hidden sm:inline">Clear All</span>
						</Button>
					</div>
				</div>
				<p className="text-muted-foreground text-sm">
					Manage the messages that float across the screen when someone has a birthday. <br />(
					<span className="font-bold">Tip:</span> You can use emojis with your system keyboard:{" "}
					<Kbd>Win + .</Kbd> or <Kbd>Cmd + Ctrl + Space</Kbd>)
				</p>
			</div>

			<div className="flex flex-wrap gap-1.5">
				{fields.map((field, index) => (
					<div key={field.id} className="flex flex-col gap-1">
						<div className="relative">
							<Input
								{...register(`messages.${index}.text`)}
								className="peer field-sizing-content h-9 rounded-full pe-9"
								placeholder="Enter a message"
								maxLength={50}
								autoComplete="off"
							/>

							<Button
								size="icon"
								variant="ghost"
								className="hover:bg-destructive/20 hover:text-destructive absolute inset-y-0 inset-e-1 my-auto h-7 w-7 rounded-full"
								onClick={() => remove(index)}
								aria-label="Delete message"
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
					<div className="text-muted-foreground py-2 text-sm italic">
						No floating messages added.
					</div>
				)}
			</div>

			<div className="flex flex-col gap-3 border-t pt-3">
				{fields.length < 10 ? (
					<div className="flex flex-col gap-3">
						<Button
							onClick={handleAdd}
							size="sm"
							className="w-fit"
							aria-label="Add floating message"
						>
							<PlusIcon className="mr-1 h-4 w-4" />
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
	);
}
