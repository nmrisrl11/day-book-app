import { AnimatedLogo } from "@/components/icons/animated-logo";
import { GithubIcon } from "@/components/icons/github-icon";
import { LineNav, type LineNavItem } from "@/components/line-nav";
import { MobileLineNav } from "@/components/mobile-line-nav";
import { SEO } from "@/components/seo/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_INFO } from "@/constants";
import { changelog } from "@/data/changelog";
import { useActiveSection } from "@/hooks";
import {
	ArrowLeftIcon,
	CalendarIcon,
	HeartIcon,
	LinkIcon,
	PaletteIcon,
	ShieldCheckIcon,
	SmartphoneIcon,
	ThumbsUpIcon,
	WifiIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
	const location = useLocation();

	useEffect(() => {
		if (location.hash) {
			const id = location.hash.replace("#", "");
			// Add a slight delay to ensure the DOM is fully painted
			setTimeout(() => {
				const element = document.getElementById(id);
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);
		} else {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [location.hash]);

	return (
		<>
			<SEO
				title="About"
				description={`Learn more about ${APP_INFO.name}, a privacy-first, local-first people manager.`}
				canonical="/about"
			/>
			<div className="relative flex h-full flex-col">
				<div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 p-4 pt-4 pb-12 md:p-8">
					{/* Back button */}
					<div>
						<Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
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
						<AnimatedLogo type="icon" className="mb-2" iconClassName="h-24 w-24 drop-shadow-sm" />
						<Badge variant="secondary" className="w-fit">
							{APP_INFO.name} v{changelog[0]?.version}
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
							{APP_INFO.tagline}
						</h1>
						<p className="mx-auto max-w-xl text-lg text-muted-foreground">
							Keep birthdays, relationships, and little memories together — privately and simply. A
							calendar can remind you that someone has a birthday. {APP_INFO.name} helps you
							remember the person.
						</p>
					</section>

					{/* Features Section */}
					<section id="features" className="flex scroll-mt-24 flex-col gap-6">
						<h2 className="text-2xl font-semibold text-foreground">Everything you need</h2>
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
								icon={<WifiIcon className="h-5 w-5" />}
								title="Device Sync"
								description="Securely sync your entire database directly between your phones and computers over your local network—no cloud required."
							/>
							<FeatureCard
								icon={<PaletteIcon className="h-5 w-5" />}
								title="Rich Personalization"
								description="Make it yours. Choose from custom avatars, light/dark themes, gradient greetings, and satisfying sound effects."
							/>
							<FeatureCard
								icon={<CalendarIcon className="h-5 w-5" />}
								title="Calendar Support"
								description="Export birthdays directly to Google Calendar or as an .ics file for Apple Calendar and Outlook."
							/>
							<FeatureCard
								icon={<SmartphoneIcon className="h-5 w-5" />}
								title="App-like Experience"
								description={`Install ${APP_INFO.name} directly to your home screen for a fast, offline-capable experience that feels just like a native app.`}
							/>
						</div>
					</section>

					{/* Privacy Section */}
					<section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:p-8">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
								<ShieldCheckIcon className="h-5 w-5" />
							</div>
							<h2 className="text-2xl font-semibold text-foreground">Your people, your data.</h2>
						</div>
						<p className="text-base leading-relaxed text-muted-foreground">
							{APP_INFO.name} is designed around <strong>local-first storage</strong>. Your birthday
							information stays on your device rather than being stored in a central database or
							requiring an account. We do not sync your data to the cloud. You are in complete
							control of your data through JSON imports, exports, and local network device syncing.
						</p>
						<p className="text-base leading-relaxed text-muted-foreground">
							We use Vercel Analytics and Speed Insights for basic usage and performance tracking to
							help improve the app. Your personal birthday records always remain private on your
							device.
						</p>
					</section>

					{/* Open Source Section */}
					<section
						id="open-source"
						className="flex scroll-mt-24 flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:p-8"
					>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
								<GithubIcon className="h-5 w-5" />
							</div>
							<h2 className="text-2xl font-semibold text-foreground">Open Source</h2>
						</div>
						<p className="text-base leading-relaxed text-muted-foreground">
							{APP_INFO.name} is a completely open-source project. We believe in transparent,
							local-first architecture where you own your data. Developers and privacy advocates are
							highly encouraged to explore the codebase, understand how data is stored, and
							contribute to the ecosystem!
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
						className="flex scroll-mt-24 flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:p-8"
					>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
								<ThumbsUpIcon className="h-5 w-5" />
							</div>
							<h2 className="text-2xl font-semibold text-foreground">Support the Project</h2>
						</div>
						<p className="text-base leading-relaxed text-muted-foreground">
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
						<h2 className="text-2xl font-semibold text-foreground">What's New</h2>
						<div className="flex flex-col gap-12">
							{visibleReleases.map((release) => (
								<div
									key={release.version}
									id={`changelog-${release.version}`}
									className="flex scroll-mt-24 flex-col gap-4 md:flex-row md:gap-8"
								>
									{/* Date & Version */}
									<div className="flex flex-col gap-1 md:sticky md:top-24 md:w-32 md:shrink-0 md:self-start md:text-right">
										<span className="font-semibold text-foreground">{release.date}</span>
										<span className="text-sm text-muted-foreground">v{release.version}</span>
									</div>

									{/* Timeline Items */}
									<div className="flex flex-col gap-4">
										<h3 className="text-xl font-bold text-foreground">{release.title}</h3>
										{release.summary && (
											<p className="mb-2 leading-relaxed text-muted-foreground">
												{release.summary}
											</p>
										)}

										<div className="ml-2 flex flex-col gap-4 border-l border-border pl-6 md:ml-0 md:pl-4">
											{release.changes.map((change, idx) => (
												<div key={idx} className="relative flex flex-col gap-1">
													<div className="absolute top-2 left-[-28.5px] h-2 w-2 rounded-full bg-border md:left-[-20.5px]" />
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
														<span className="font-semibold text-foreground">{change.title}</span>
													</div>
													<p className="text-sm leading-relaxed text-muted-foreground">
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
				<aside className="fixed top-1/2 right-4 hidden w-50 -translate-y-1/2 flex-col xl:flex 2xl:right-16 2xl:w-60">
					<h3 className="mb-2 shrink-0 px-3 font-semibold text-foreground">On this page</h3>
					<div className="custom-scrollbar max-h-[80dvh] overflow-x-hidden overflow-y-auto pb-4">
						<LineNav items={navItems} activeId={activeId} />
					</div>
				</aside>

				{/* Mobile Line Nav */}
				<MobileLineNav items={navItems} activeId={activeId} />
			</div>
		</>
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
		<div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
			<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
				{icon}
			</div>
			<h3 className="font-semibold text-foreground">{title}</h3>
			<p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
		</div>
	);
}
