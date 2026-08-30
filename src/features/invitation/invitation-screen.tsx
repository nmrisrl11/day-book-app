import { AnimatedLogo } from "@/components/icons/animated-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_INFO } from "@/constants/app-info";
import { generateResponseToken, parseInvitationToken } from "@/helpers/invitation-token";
import { cn } from "@/lib/utils";
import {
	inviteeSchema,
	type InviteeFormData,
	type InviteeFormInput,
} from "@/schema/birthday-schema";
import {
	GIFT_IDEA_MAX_COUNT,
	GIFT_IDEA_MAX_LENGTH,
	NAME_MAX_LENGTH,
	NAME_MIN_LENGTH,
} from "@/schema/validation-constants";
import { useDayBookStore } from "@/store/day-book-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { play } from "cuelume";
import { CheckIcon, CopyIcon, PlusIcon, ShareIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export function InvitationScreen() {
	const [token] = useQueryState("t");
	const [responseLink, setResponseLink] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const invitation = token ? parseInvitationToken(token) : null;

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<InviteeFormInput, unknown, InviteeFormData>({
		resolver: zodResolver(inviteeSchema),
		defaultValues: { name: "", birthday: "", giftIdeas: [] },
	});

	const [giftIdeaInput, setGiftIdeaInput] = useState("");
	const giftIdeas = watch("giftIdeas") || [];

	const soundSettings = useDayBookStore((state) => state.settings.soundSettings);

	const onError = () => {
		if (soundSettings?.enabled) {
			play(soundSettings.mappings.error, { volume: soundSettings.volume });
		}
	};

	if (!token || !invitation) {
		return (
			<main className="flex min-h-[75vh] flex-col items-center justify-center space-y-8 p-6 text-center">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", bounce: 0.5 }}
					className="flex justify-center"
				>
					<AnimatedLogo
						key="warning"
						autoPlay
						variant="warning"
						type="icon"
						className="h-24 w-24 sm:h-32 sm:w-32"
						iconClassName="h-full w-full drop-shadow-sm"
					/>
				</motion.div>

				<div className="space-y-3">
					<h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
						Link Expired
					</h1>
					<p className="text-muted-foreground mx-auto max-w-md text-lg">
						This invitation is no longer valid. It may have expired or been corrupted. Ask your
						friend for a new link!
					</p>
				</div>

				<Button asChild size="lg" className="mt-4 transition-shadow hover:shadow-md">
					<Link to="/">Back to Dashboard</Link>
				</Button>
			</main>
		);
	}

	const onSubmit = (data: InviteeFormData) => {
		const rToken = generateResponseToken(data.name, data.birthday, data.giftIdeas);
		const link = `${window.location.origin}/invite/response?t=${rToken}`;
		setResponseLink(link);
	};

	const handleCopy = async () => {
		if (!responseLink) return;
		try {
			await navigator.clipboard.writeText(responseLink);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (e) {
			console.error("Failed to copy", e);
		}
	};

	const handleShare = async () => {
		if (!responseLink) return;
		try {
			await navigator.share({
				title: "My Birthday",
				text: `Here is my birthday for ${APP_INFO.name}!`,
				url: responseLink,
			});
		} catch (e) {
			console.error("Failed to share", e);
		}
	};

	if (responseLink) {
		return (
			<div className="mx-auto flex w-full max-w-md flex-col gap-6 pt-10 pb-20">
				<div className="flex flex-col items-center gap-2 text-center">
					<AnimatedLogo
						key="share"
						autoPlay
						variant="share"
						type="icon"
						className="mb-4"
						iconClassName="h-24 w-24 drop-shadow-sm"
					/>
					<h2 className="text-2xl font-bold tracking-tight">Your birthday is ready to share!</h2>
					<p className="text-muted-foreground">
						Send this link back to <strong>{invitation.n}</strong> so they can remember your special
						day.
					</p>
				</div>

				<div className="bg-card flex w-full min-w-0 flex-col gap-6 rounded-xl border p-4 shadow-sm md:p-6">
					<div className="flex w-full min-w-0 flex-col gap-3">
						<div className="bg-muted relative flex w-full min-w-0 flex-col gap-2 overflow-hidden rounded-lg p-3 pr-12">
							<Label className="text-muted-foreground shrink-0 text-xs font-semibold uppercase">
								Response Link
							</Label>
							<p className="overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap">
								{responseLink}
							</p>
							<Button
								variant="ghost"
								size="icon"
								className={cn(
									"absolute top-2 right-2 h-8 w-8 transition-colors",
									copied
										? "text-green-600 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30"
										: "text-muted-foreground hover:text-foreground",
								)}
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

						{typeof navigator !== "undefined" && "share" in navigator && (
							<Button variant="outline" onClick={handleShare} className="w-full">
								<ShareIcon className="mr-2 h-4 w-4" aria-hidden="true" />
								Share Link
							</Button>
						)}
					</div>
					<div className="bg-primary/10 text-primary mt-2 rounded-md p-3 text-xs leading-relaxed">
						<strong>Privacy Note:</strong> This is a local-first application. The link contains your
						encoded name and birthday and expires in 12 hours.{" "}
						<strong>Do not post this link publicly.</strong> Only share it privately with people you
						trust.
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-md flex-col gap-6 pt-10 pb-20">
			<div className="flex flex-col items-center gap-2 text-center">
				<AnimatedLogo
					key="invite"
					autoPlay
					variant="invite"
					type="icon"
					className="mb-2"
					iconClassName="h-24 w-24 drop-shadow-sm"
				/>
				<h2 className="text-2xl font-bold tracking-tight">
					Help {invitation.n} remember your birthday
				</h2>
				<p className="text-muted-foreground">
					Enter your information below so they can add you to their {APP_INFO.name}.
				</p>
			</div>

			<form
				onSubmit={(e) => void handleSubmit(onSubmit, onError)(e)}
				className="bg-card flex flex-col gap-6 rounded-xl border p-4 shadow-sm md:p-6"
			>
				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Name or nickname</Label>
					<Input
						id="name"
						{...register("name")}
						placeholder="e.g. Sarah"
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
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="birthday">When's your birthday?</Label>
					<Input
						id="birthday"
						type="date"
						{...register("birthday")}
						className="dark:scheme-dark"
						autoComplete="off"
					/>
					{errors.birthday && (
						<p className="text-destructive text-sm font-medium" role="alert">
							{errors.birthday.message}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2 pt-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="giftIdea">Gift Ideas / Wish List (Optional)</Label>
						<span className="text-muted-foreground text-xs">
							{giftIdeas.length}/{GIFT_IDEA_MAX_COUNT}
						</span>
					</div>
					<p className="text-muted-foreground text-xs">Share things you'd love to receive!</p>

					{giftIdeas.length > 0 && (
						<div className="mb-2 flex flex-wrap gap-2">
							{giftIdeas.map((idea) => (
								<div
									key={idea}
									className="bg-primary/10 text-primary flex h-auto max-w-full items-center gap-1.5 whitespace-normal wrap-break-word rounded-2xl px-3 py-1 text-left text-xs font-medium"
								>
									<span className="min-w-0 flex-1 wrap-break-word">{idea}</span>
									<button
										type="button"
										aria-label={`Remove gift idea: ${idea}`}
										onClick={() => {
											setValue(
												"giftIdeas",
												giftIdeas.filter((g) => g !== idea),
												{ shouldValidate: true },
											);
										}}
										className="hover:bg-primary/20 rounded-full p-0.5"
										title={`Remove gift idea: ${idea}`}
									>
										<XIcon className="h-3 w-3" aria-hidden="true" />
									</button>
								</div>
							))}
						</div>
					)}

					<div className="flex gap-2">
						<Input
							id="giftIdea"
							value={giftIdeaInput}
							onChange={(e) => setGiftIdeaInput(e.target.value)}
							placeholder="e.g. Favorite coffee beans"
							autoComplete="off"
							maxLength={GIFT_IDEA_MAX_LENGTH}
							disabled={giftIdeas.length >= GIFT_IDEA_MAX_COUNT}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									const trimmed = giftIdeaInput.trim();
									if (
										trimmed &&
										trimmed.length <= GIFT_IDEA_MAX_LENGTH &&
										giftIdeas.length < GIFT_IDEA_MAX_COUNT &&
										!giftIdeas.includes(trimmed)
									) {
										setValue("giftIdeas", [...giftIdeas, trimmed], { shouldValidate: true });
										setGiftIdeaInput("");
									}
								}
							}}
						/>
						<Button
							type="button"
							size="icon"
							variant="secondary"
							aria-label="Add gift idea"
							title="Add gift idea"
							className="shrink-0"
							disabled={giftIdeas.length >= GIFT_IDEA_MAX_COUNT || !giftIdeaInput.trim()}
							onClick={(e) => {
								e.preventDefault();
								const trimmed = giftIdeaInput.trim();
								if (
									trimmed &&
									giftIdeas.length < GIFT_IDEA_MAX_COUNT &&
									trimmed.length <= GIFT_IDEA_MAX_LENGTH &&
									!giftIdeas.includes(trimmed)
								) {
									setValue("giftIdeas", [...giftIdeas, trimmed], { shouldValidate: true });
									setGiftIdeaInput("");
								}
							}}
						>
							<PlusIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
					</div>
					{errors.giftIdeas && (
						<p className="text-destructive text-sm font-medium" role="alert">
							{errors.giftIdeas.message}
						</p>
					)}
				</div>

				<Button type="submit" className="mt-2 w-full">
					Save & Share
				</Button>
			</form>
		</div>
	);
}
