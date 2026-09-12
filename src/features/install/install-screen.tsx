import { AnimatedLogo } from "@/components/icons/animated-logo";
import { SEO } from "@/components/seo/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_INFO } from "@/constants/app-info";
import { useInstallApp } from "@/hooks/use-install-app";
import {
	ArrowLeftIcon,
	CheckCircle2Icon,
	DownloadIcon,
	MonitorSmartphoneIcon,
	ShareIcon,
	WifiOffIcon,
	ZapIcon,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export function InstallScreen() {
	const { isInstallable, isInstalled, isIOS, isDesktop, isChecking, promptInstall } =
		useInstallApp();
	const navigate = useNavigate();

	return (
		<>
			<SEO title="Install App" canonical="/install" />
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
					<section className="flex flex-col items-center gap-4 text-center">
						<AnimatedLogo type="icon" className="mb-2" iconClassName="h-24 w-24 drop-shadow-sm" />
						<Badge variant="secondary" className="w-fit">
							Get the App
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
							Install {APP_INFO.name}
						</h1>
						<p className="mx-auto max-w-xl text-lg text-muted-foreground">
							Enjoy a faster, full-screen experience that works offline. Install {APP_INFO.name}{" "}
							directly to your home screen or desktop without using an app store.
						</p>

						{/* Action Area */}
						<div className="mt-4 flex w-full max-w-sm flex-col items-center gap-4">
							{isInstalled ? (
								<div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-6 text-center">
									<CheckCircle2Icon className="h-12 w-12 text-primary" />
									<div className="flex flex-col gap-1">
										<h2 className="font-bold text-primary">App is Installed!</h2>
										<p className="text-sm text-muted-foreground">
											You are currently using the installed version of {APP_INFO.name}.
										</p>
									</div>
									<Button className="mt-2 w-full" onClick={() => navigate("/")}>
										Open Dashboard
									</Button>
								</div>
							) : isInstallable ? (
								<Button
									size="lg"
									className="w-full text-base font-semibold"
									onClick={promptInstall}
								>
									<DownloadIcon className="mr-2 h-5 w-5" />
									Install App Now
								</Button>
							) : isIOS ? (
								<div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
										<ShareIcon className="h-6 w-6" />
									</div>
									<div className="flex flex-col gap-1">
										<h2 className="font-bold text-foreground">iOS Installation</h2>
										<p className="text-sm leading-relaxed text-muted-foreground">
											To install on your iPhone or iPad, tap the{" "}
											<strong className="text-foreground">Share</strong> icon in your browser menu,
											then select <strong className="text-foreground">Add to Home Screen</strong>.
										</p>
									</div>
								</div>
							) : isChecking ? (
								<Skeleton className="h-14 w-full rounded-md" />
							) : isDesktop ? (
								<div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
										<MonitorSmartphoneIcon className="h-6 w-6" />
									</div>
									<div className="flex flex-col gap-1">
										<h2 className="font-bold text-foreground">Browser Installation</h2>
										<p className="text-sm leading-relaxed text-muted-foreground">
											You can install this app manually. Look for an <strong>install icon</strong>{" "}
											in your address bar, or check your browser's menu for{" "}
											<strong className="text-foreground">Install App</strong>.
										</p>
									</div>
								</div>
							) : (
								<div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-border bg-muted p-6 text-center">
									<div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
										<MonitorSmartphoneIcon className="h-5 w-5" />
									</div>
									<h2 className="font-bold text-foreground">Installation Unavailable</h2>
									<p className="text-sm leading-relaxed text-muted-foreground">
										The app might already be installed, or your browser doesn't support direct
										installation.
									</p>
								</div>
							)}
						</div>
					</section>

					{/* Benefits Section */}
					<section className="mt-4 flex flex-col gap-6">
						<h2 className="text-2xl font-semibold text-foreground">Why install?</h2>
						<div className="grid gap-4 sm:grid-cols-3">
							<FeatureCard
								icon={<WifiOffIcon className="h-5 w-5" />}
								title="Offline Access"
								description="No internet? No problem. View and manage your birthdays anywhere."
							/>
							<FeatureCard
								icon={<MonitorSmartphoneIcon className="h-5 w-5" />}
								title="Full Screen"
								description="Enjoy a clean, app-like experience without browser navigation bars getting in the way."
							/>
							<FeatureCard
								icon={<ZapIcon className="h-5 w-5" />}
								title="Instant Load"
								description="The app is cached on your device, meaning it launches instantly every single time."
							/>
						</div>
					</section>
				</div>
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
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
				{icon}
			</div>
			<h3 className="font-semibold text-foreground">{title}</h3>
			<p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
		</div>
	);
}
