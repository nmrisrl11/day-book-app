import { AnimatedLogo } from "@/components/icons/animated-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { APP_INFO } from "@/constants/app-info";
import { parseResponseToken } from "@/helpers/invitation-token";
import { BirthdayRepository } from "@/lib/birthday-repository";
import { db } from "@/lib/db";
import { RELATIONSHIP_OPTIONS, type Relationship } from "@/types/birthday";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertTriangleIcon, CalendarIcon, GiftIcon, HomeIcon, UserIcon } from "lucide-react";
import { motion } from "motion/react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { Link } from "react-router-dom";

export function ResponseScreen() {
	const [token] = useQueryState("t");
	const [added, setAdded] = useState(false);
	const [relationship, setRelationship] = useState<Relationship | "">("");
	const [error, setError] = useState("");

	const birthdays = useLiveQuery(() => db.birthdays.toArray(), []) ?? [];

	const response = token ? parseResponseToken(token) : null;

	if (!token || !response) {
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
						Response Expired
					</h1>
					<p className="text-muted-foreground mx-auto max-w-md text-lg">
						We couldn't read the birthday from this link. It might have expired or been corrupted.
						Please ask for it to be sent again!
					</p>
				</div>

				<Button asChild size="lg" className="mt-4 transition-shadow hover:shadow-md">
					<Link to="/">Back to Dashboard</Link>
				</Button>
			</main>
		);
	}

	const isDuplicate = birthdays.some(
		(b) => b.name.toLowerCase().trim() === response.n.toLowerCase().trim(),
	);

	const handleAdd = async () => {
		if (!relationship) {
			setError("Please select a relationship before adding.");
			return;
		}

		await BirthdayRepository.save({
			id: crypto.randomUUID(),
			name: response.n,
			birthday: response.b,
			relationship: relationship,
			notes: [],
			giftIdeas: response.g || [],
		});
		setAdded(true);
	};

	if (added) {
		return (
			<div className="flex w-full flex-col items-center justify-center pt-24 pb-32">
				<div className="border-border bg-card/50 flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-4 py-16 text-center">
					<AnimatedLogo
						key="share"
						autoPlay
						variant="share"
						type="icon"
						className="mx-auto mb-2"
						iconClassName="h-24 w-24 drop-shadow-sm"
					/>
					<h3 className="mb-2 text-lg font-semibold">Birthday Added!</h3>
					<p className="text-muted-foreground mb-6">
						<strong>{response.n}</strong> has been added to your {APP_INFO.name}.
					</p>
					<div className="flex gap-4">
						<Button asChild variant="outline">
							<Link to="/">
								<HomeIcon className="mr-2 h-4 w-4" />
								Dashboard
							</Link>
						</Button>
						<Button asChild>
							<Link to="/manage">Manage Birthdays</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const [year, month, day] = response.b.split("-").map(Number);
	const formattedDate = new Date(year, month - 1, day).toLocaleDateString(undefined, {
		month: "long",
		day: "numeric",
	});

	return (
		<div className="mx-auto flex w-full max-w-md flex-col gap-6 pt-10 pb-20">
			<div className="flex flex-col items-center gap-2 text-center">
				<AnimatedLogo
					key="response"
					autoPlay
					variant="response"
					type="icon"
					className="mb-2"
					iconClassName="h-24 w-24 drop-shadow-sm"
				/>
				<h2 className="text-2xl font-bold tracking-tight">Birthday received!</h2>
				<p className="text-muted-foreground">
					<strong>{response.n}</strong> shared their birthday with you.
				</p>
			</div>

			<div className="bg-card flex flex-col gap-6 rounded-xl border p-4 shadow-sm md:p-6">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
							<UserIcon className="h-5 w-5" />
						</div>
						<div className="flex flex-col">
							<span className="text-muted-foreground text-xs font-medium uppercase">Name</span>
							<span className="font-medium">{response.n}</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
							<CalendarIcon className="h-5 w-5" />
						</div>
						<div className="flex flex-col">
							<span className="text-muted-foreground text-xs font-medium uppercase">Birthday</span>
							<span className="font-medium">{formattedDate}</span>
						</div>
					</div>

					{response.g && response.g.length > 0 && (
						<div className="flex items-start gap-3">
							<div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
								<GiftIcon className="h-5 w-5" />
							</div>
							<div className="flex flex-col">
								<span className="text-muted-foreground text-xs font-medium uppercase">
									Gift Ideas
								</span>
								<div className="flex flex-wrap gap-1.5 mt-1">
									{response.g.map((idea, idx) => (
										<Badge
											key={idx}
											variant="outline"
											className="border-amber-500/30 shadow-black/5 h-auto max-w-full whitespace-normal wrap-break-word text-left"
										>
											<span
												className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/80"
												data-icon="inline-start"
											/>
											<span className="min-w-0 wrap-break-word">{idea}</span>
										</Badge>
									))}
								</div>
							</div>
						</div>
					)}
				</div>

				{isDuplicate && (
					<div className="flex items-start gap-3 rounded-md bg-amber-500/10 p-3 text-sm text-amber-600">
						<AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
						<div className="flex flex-col">
							<span className="font-medium">Possible Duplicate</span>
							<span>This person may already be in your birthday list.</span>
						</div>
					</div>
				)}

				<div className="flex flex-col gap-2 pt-2 pb-2">
					<Label htmlFor="relationship">
						Relationship <span className="text-destructive">*</span>
					</Label>
					<Select
						value={relationship}
						onValueChange={(val) => {
							setRelationship(val as Relationship);
							setError("");
						}}
					>
						<SelectTrigger id="relationship" className="w-full">
							<SelectValue placeholder="Select relationship" />
						</SelectTrigger>
						<SelectContent position="popper">
							{RELATIONSHIP_OPTIONS.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{error && (
						<p className="text-destructive text-sm font-medium" role="alert">
							{error}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-3 pt-2">
					<Button onClick={handleAdd} className="w-full">
						Add to birthdays
					</Button>
					<Button asChild variant="ghost" className="w-full">
						<Link to="/">Not now</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
