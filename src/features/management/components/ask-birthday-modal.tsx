import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateInvitationToken } from "@/helpers/invitation-token";
import { birthdaySchema } from "@/schema/birthday-schema";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "@/schema/validation-constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CopyIcon, ShareIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const askBirthdaySchema = birthdaySchema.pick({ name: true });
type AskBirthdayFormData = z.infer<typeof askBirthdaySchema>;

interface AskBirthdayModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AskBirthdayModal({ open, onOpenChange }: AskBirthdayModalProps) {
	const [generatedLink, setGeneratedLink] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<AskBirthdayFormData>({
		resolver: zodResolver(askBirthdaySchema),
		defaultValues: { name: "" },
		mode: "onChange",
	});

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setTimeout(() => {
				reset();
				setGeneratedLink(null);
				setCopied(false);
			}, 200);
		}
		onOpenChange(newOpen);
	};

	const onGenerate = (data: AskBirthdayFormData) => {
		const token = generateInvitationToken(data.name);
		const link = `${window.location.origin}/invite?t=${token}`;
		setGeneratedLink(link);
	};

	const handleCopy = async () => {
		if (!generatedLink) return;
		try {
			await navigator.clipboard.writeText(generatedLink);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (e) {
			console.error("Failed to copy", e);
		}
	};

	const handleShare = async () => {
		if (!generatedLink) return;
		try {
			await navigator.share({
				title: "Share your birthday",
				text: `Hi! I'm adding birthdays to my calendar. Could you share yours with me using this private link?`,
				url: generatedLink,
			});
		} catch (e) {
			console.error("Failed to share", e);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Ask for a Birthday</DialogTitle>
					<DialogDescription>
						Generate a private link to send to someone so they can provide their birthday
						themselves.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-4">
					{!generatedLink ? (
						<form
							id="ask-birthday-form"
							onSubmit={handleSubmit(onGenerate)}
							className="flex flex-col gap-3"
						>
							<Label htmlFor="inviter-name">Your name or nickname</Label>
							<Input
								id="inviter-name"
								placeholder="e.g. John"
								{...register("name")}
								autoComplete="off"
								autoFocus
								minLength={NAME_MIN_LENGTH}
								maxLength={NAME_MAX_LENGTH}
							/>
							{errors.name && (
								<p className="text-destructive text-sm font-medium" role="alert">
									{errors.name.message}
								</p>
							)}
							<p className="text-muted-foreground text-xs">
								This will be shown to the person receiving the link so they know who is asking.
							</p>
						</form>
					) : (
						<div className="flex flex-col gap-4">
							<div className="bg-muted relative flex flex-col gap-2 rounded-lg p-3 pr-12">
								<Label className="text-muted-foreground text-xs font-semibold uppercase">
									Shareable Link
								</Label>
								<p className="text-sm font-medium break-all">{generatedLink}</p>
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:text-foreground absolute top-2 right-2 h-8 w-8"
									onClick={handleCopy}
									title="Copy link"
									aria-label="Copy link"
								>
									{copied ? (
										<CheckIcon className="h-4 w-4" aria-hidden="true" />
									) : (
										<CopyIcon className="h-4 w-4" aria-hidden="true" />
									)}
								</Button>
							</div>

							<div className="bg-primary/10 text-primary rounded-md p-3 text-xs leading-relaxed">
								<strong>Privacy Note:</strong> This is a local-first application. To make sharing
								work without user accounts, this link contains your encoded name. Only share this
								link with people you trust.
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="ghost" onClick={() => handleOpenChange(false)}>
						{generatedLink ? "Done" : "Cancel"}
					</Button>

					{!generatedLink ? (
						<Button type="submit" form="ask-birthday-form" disabled={!isValid}>
							Generate Link
						</Button>
					) : (
						<div className="flex flex-col gap-2 sm:flex-row">
							{typeof navigator !== "undefined" && "share" in navigator && (
								<Button onClick={handleShare}>
									<ShareIcon className="mr-2 h-4 w-4" aria-hidden="true" />
									Share Link
								</Button>
							)}
						</div>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
