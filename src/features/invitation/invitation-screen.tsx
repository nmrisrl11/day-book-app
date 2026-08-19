import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateResponseToken, parseInvitationToken } from "@/helpers/invitation-token";
import { birthdaySchema, type BirthdayFormData } from "@/schema/birthday-schema";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "@/schema/validation-constants";
import { useDayBookStore } from "@/store/day-book-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { play } from "cuelume";
import { CheckIcon, CopyIcon, HomeIcon, ShareIcon } from "lucide-react";
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
		formState: { errors },
	} = useForm<BirthdayFormData>({
		resolver: zodResolver(birthdaySchema),
		defaultValues: { name: "", birthday: "" },
	});

	const soundSettings = useDayBookStore((state) => state.settings.soundSettings);

	const onError = () => {
		if (soundSettings?.enabled) {
			play(soundSettings.mappings.error, { volume: soundSettings.volume });
		}
	};

	if (!token || !invitation) {
		return (
			<div className="flex w-full flex-col items-center justify-center pt-24 pb-32">
				<div className="border-border bg-card/50 flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-4 py-16 text-center">
					<div className="mb-2 text-6xl">😕</div>
					<h3 className="mb-2 text-lg font-semibold">Invalid or Expired Link</h3>
					<p className="text-muted-foreground mb-6">
						This birthday link isn't valid, has been corrupted, or has expired after 24 hours.
					</p>
					<Button asChild variant="outline">
						<Link to="/">
							<HomeIcon className="mr-2 h-4 w-4" />
							Go Home
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	const onSubmit = (data: BirthdayFormData) => {
		const rToken = generateResponseToken(data.name, data.birthday);
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
				text: `Here is my birthday for DayBook!`,
				url: responseLink,
			});
		} catch (e) {
			console.error("Failed to share", e);
		}
	};

	if (responseLink) {
		return (
			<div className="mx-auto flex w-full max-w-md flex-col gap-6 pt-10 pb-20">
				<div className="flex flex-col gap-2 text-center">
					<div className="mb-4 text-6xl">🎉</div>
					<h2 className="text-2xl font-bold tracking-tight">Your birthday is ready to share!</h2>
					<p className="text-muted-foreground">
						Send this link back to <strong>{invitation.n}</strong> so they can remember your special
						day.
					</p>
				</div>

				<div className="bg-card flex flex-col gap-6 rounded-xl border p-4 shadow-sm md:p-6">
					<div className="flex flex-col gap-3">
						<div className="bg-muted relative flex flex-col gap-2 rounded-lg p-3 pr-12">
							<Label className="text-muted-foreground text-xs font-semibold uppercase">
								Response Link
							</Label>
							<p className="text-sm font-medium break-all">{responseLink}</p>
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:text-foreground absolute top-2 right-2 h-8 w-8"
								onClick={handleCopy}
								title="Copy link"
							>
								{copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
							</Button>
						</div>

						{typeof navigator !== "undefined" && "share" in navigator && (
							<Button variant="outline" onClick={handleShare} className="w-full">
								<ShareIcon className="mr-2 h-4 w-4" />
								Share Link
							</Button>
						)}
					</div>
					<div className="bg-primary/10 text-primary mt-2 rounded-md p-3 text-xs leading-relaxed">
						<strong>Privacy Note:</strong> This is a local-first application. The link contains your
						encoded name and birthday. Only share this link with people you trust.
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-md flex-col gap-6 pt-10 pb-20">
			<div className="flex flex-col gap-2 text-center">
				<div className="mb-2 text-6xl">👋</div>
				<h2 className="text-2xl font-bold tracking-tight">
					Help {invitation.n} remember your birthday
				</h2>
				<p className="text-muted-foreground">
					Enter your information below so they can add you to their DayBook.
				</p>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit, onError)}
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

				<Button type="submit" className="mt-2 w-full">
					Save & Share
				</Button>
			</form>
		</div>
	);
}
