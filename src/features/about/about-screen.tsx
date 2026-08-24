import { GithubIcon } from "@/components/icons/github-icon";
import { InteractiveLogo } from "@/components/interactive-logo";
import { LineNav, type LineNavItem } from "@/components/line-nav";
import { MobileLineNav } from "@/components/mobile-line-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_INFO } from "@/constants/app-info";
import { changelog } from "@/data/changelog";
import { useActiveSection } from "@/hooks/use-active-section";
import {
	ArrowLeftIcon,
	CalendarIcon,
	HeartIcon,
	LinkIcon,
	ShieldCheckIcon,
	SmartphoneIcon,
	ThumbsUpIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export function AboutScreen() {
	const [visibleCount, setVisibleCount] = useState(3);
	const visibleReleases = changelog.slice(0, visibleCount);
	const hasMore = visibleCount < changelog.length;

	const navItems: LineNavItem[] = [
		{ id: "overview", label: "Overview" },
		{ id: "features", label: "Features" },
		{ id: "open-source", label: "Open Source" },
		{ id: "community", label: "Community" },
		{
			id: "whats-new",
			label: "What's New",
			children: visibleReleases.map((r) => ({
				id: `changelog-${r.version}`,
				label: `v${r.version}`,
			})),
		},
	];

	const trackedIds = [
		"overview",
		"features",
		"open-source",
		"community",
		"whats-new",
		...visibleReleases.map((r) => `changelog-${r.version}`),
	];

	const activeId = useActiveSection(trackedIds);

	return (
		<div className="relative flex h-full flex-col">
			<div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 p-4 pt-4 pb-12 md:p-8">
				{/* Back button */}
				<div>
					<Button variant="ghost" size="sm" asChild className="text-muted-foreground -ml-2">
						<Link to="/">
							<ArrowLeftIcon className="mr-2 h-4 w-4" />
							Back to Dashboard
						</Link>
					</Button>
				</div>

				{/* Hero Section */}
				<section
					id="overview"
					className="flex scroll-mt-24 flex-col items-center gap-4 text-center"
				>
					<InteractiveLogo type="icon" className="mb-2" iconClassName="h-24 w-24 drop-shadow-sm" />
					<Badge variant="secondary" className="w-fit">
						{APP_INFO.name} v{changelog[0]?.version}
					</Badge>
					<h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
						{APP_INFO.tagline}
					</h1>
					<p className="text-muted-foreground mx-auto max-w-xl text-lg">
						Keep birthdays, relationships, and little memories together — privately and simply. A
						calendar can remind you that someone has a birthday. {APP_INFO.name} helps you remember
						the person.
					</p>
				</section>

				{/* Features Section */}
				<section id="features" className="flex scroll-mt-24 flex-col gap-6">
					<h2 className="text-foreground text-2xl font-semibold">Everything you need</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						<FeatureCard
							icon={<HeartIcon className="h-5 w-5" />}
							title="People & Relationships"
							description="Store relationships and small personal notes. Turn a simple birthday record into a lightweight person card."
						/>
						<FeatureCard
							icon={<LinkIcon className="h-5 w-5" />}
							title="Birthday Links"
							description="Ask friends and family for their birthday through a shareable link. Import their response instantly."
						/>
						<FeatureCard
							icon={<CalendarIcon className="h-5 w-5" />}
							title="Calendar Support"
							description="Export birthdays directly to Google Calendar or as an .ics file for Apple Calendar and Outlook."
						/>
						<FeatureCard
							icon={<SmartphoneIcon className="h-5 w-5" />}
							title="App-like Experience"
							description={`Install ${APP_INFO.name} as a Progressive Web App (PWA) for a fast, offline-capable experience on any device.`}
						/>
					</div>
				</section>

				{/* Privacy Section */}
				<section className="bg-card border-border flex flex-col gap-4 rounded-3xl border p-6 sm:p-8">
					<div className="flex items-center gap-3">
						<div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
							<ShieldCheckIcon className="h-5 w-5" />
						</div>
						<h2 className="text-foreground text-2xl font-semibold">Your people, your data.</h2>
					</div>
					<p className="text-muted-foreground text-base leading-relaxed">
						{APP_INFO.name} is designed around <strong>local-first storage</strong>. Your birthday
						information stays on your device rather than being stored in a central database or
						requiring an account. We do not sync your data to the cloud. You are in complete control
						of your data through JSON imports and exports.
					</p>
					<p className="text-muted-foreground text-base leading-relaxed">
						We use Vercel Analytics and Speed Insights for basic usage and performance tracking to
						help improve the app. Your personal birthday records always remain private on your
						device.
					</p>
				</section>

				{/* Open Source Section */}
				<section
					id="open-source"
					className="bg-card border-border flex scroll-mt-24 flex-col gap-4 rounded-3xl border p-6 sm:p-8"
				>
					<div className="flex items-center gap-3">
						<div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
							<GithubIcon className="h-5 w-5" />
						</div>
						<h2 className="text-foreground text-2xl font-semibold">Open Source</h2>
					</div>
					<p className="text-muted-foreground text-base leading-relaxed">
						{APP_INFO.name} is a completely open-source project. We believe in transparent,
						local-first architecture where you own your data. Developers and privacy advocates are
						highly encouraged to explore the codebase, understand how data is stored, and contribute
						to the ecosystem!
					</p>
					<Button variant="outline" className="mt-2 w-fit" asChild>
						<a
							href="https://github.com/nmrisrl11/day-book-app"
							target="_blank"
							rel="noopener noreferrer"
						>
							<GithubIcon aria-hidden="true" className="mr-2 h-4 w-4" />
							View Repository on GitHub
						</a>
					</Button>
				</section>

				{/* Community Section */}
				<section
					id="community"
					className="bg-card border-border flex scroll-mt-24 flex-col gap-4 rounded-3xl border p-6 sm:p-8"
				>
					<div className="flex items-center gap-3">
						<div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
							<ThumbsUpIcon className="h-5 w-5" />
						</div>
						<h2 className="text-foreground text-2xl font-semibold">Support the Project</h2>
					</div>
					<p className="text-muted-foreground text-base leading-relaxed">
						Love using {APP_INFO.name}? Help us grow by showing your support on App Builders PH!
						Your upvotes and feedback help us reach more people and continue improving the app.
					</p>
					<Button variant="outline" className="mt-2 w-fit" asChild>
						<a
							href="https://appbuildersph.com/apps/daybook"
							target="_blank"
							rel="noopener noreferrer"
						>
							<ThumbsUpIcon aria-hidden="true" className="mr-2 h-4 w-4" />
							Upvote on App Builders PH
						</a>
					</Button>
				</section>

				{/* Changelog Section */}
				<section id="whats-new" className="flex scroll-mt-24 flex-col gap-8">
					<h2 className="text-foreground text-2xl font-semibold">What's New</h2>
					<div className="flex flex-col gap-12">
						{visibleReleases.map((release) => (
							<div
								key={release.version}
								id={`changelog-${release.version}`}
								className="flex scroll-mt-24 flex-col gap-4 md:flex-row md:gap-8"
							>
								{/* Date & Version */}
								<div className="flex flex-col gap-1 md:sticky md:top-24 md:w-32 md:shrink-0 md:self-start md:text-right">
									<span className="text-foreground font-semibold">{release.date}</span>
									<span className="text-muted-foreground text-sm">v{release.version}</span>
								</div>

								{/* Timeline Items */}
								<div className="flex flex-col gap-4">
									<h3 className="text-foreground text-xl font-bold">{release.title}</h3>
									{release.summary && (
										<p className="text-muted-foreground mb-2 leading-relaxed">{release.summary}</p>
									)}

									<div className="border-border ml-2 flex flex-col gap-4 border-l pl-6 md:ml-0 md:pl-4">
										{release.changes.map((change, idx) => (
											<div key={idx} className="relative flex flex-col gap-1">
												<div className="bg-border absolute top-2 left-[-28.5px] h-2 w-2 rounded-full md:left-[-20.5px]" />
												<div className="flex flex-wrap items-center gap-2">
													<Badge
														variant={
															change.type === "added"
																? "default"
																: change.type === "fixed"
																	? "destructive"
																	: "secondary"
														}
														className="text-[0.65rem] tracking-wider uppercase"
													>
														{change.type}
													</Badge>
													<span className="text-foreground font-semibold">{change.title}</span>
												</div>
												<p className="text-muted-foreground text-sm leading-relaxed">
													{change.description}
												</p>
											</div>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				{hasMore && (
					<div className="flex justify-center pt-8">
						<Button variant="outline" onClick={() => setVisibleCount((c) => c + 3)}>
							View More Updates
						</Button>
					</div>
				)}
			</div>

			{/* Desktop Line Nav */}
			<aside className="fixed top-32 right-4 hidden w-50 xl:block 2xl:right-16 2xl:w-60">
				<h3 className="text-foreground mb-2 px-3 font-semibold">On this page</h3>
				<LineNav items={navItems} activeId={activeId} />
			</aside>

			{/* Mobile Line Nav */}
			<MobileLineNav items={navItems} activeId={activeId} />
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-5">
			<div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
				{icon}
			</div>
			<h3 className="text-foreground font-semibold">{title}</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
		</div>
	);
}
