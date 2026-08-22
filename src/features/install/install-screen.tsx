import { LogoIcon } from "@/components/icons/logo-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
	const { isInstallable, isInstalled, isIOS, promptInstall } = useInstallApp();
	const navigate = useNavigate();

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
				<section className="flex flex-col items-center gap-4 text-center">
					<LogoIcon className="mb-2 h-24 w-24 drop-shadow-sm" />
					<Badge variant="secondary" className="w-fit">
						Get the App
					</Badge>
					<h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
						Install {APP_INFO.name}
					</h1>
					<p className="text-muted-foreground mx-auto max-w-xl text-lg">
						Enjoy a faster, full-screen experience that works offline. Install {APP_INFO.name} directly to your home screen or desktop without using an app store.
					</p>

					{/* Action Area */}
					<div className="mt-4 flex w-full max-w-sm flex-col items-center gap-4">
						{isInstalled ? (
							<div className="bg-primary/10 border-primary/20 flex w-full flex-col items-center gap-3 rounded-2xl border p-6 text-center">
								<CheckCircle2Icon className="text-primary h-12 w-12" />
								<div className="flex flex-col gap-1">
									<h2 className="text-primary font-bold">App is Installed!</h2>
									<p className="text-muted-foreground text-sm">
										You are currently using the installed version of {APP_INFO.name}.
									</p>
								</div>
								<Button className="mt-2 w-full" onClick={() => navigate("/")}>
									Open Dashboard
								</Button>
							</div>
						) : isInstallable ? (
							<Button size="lg" className="w-full text-base font-semibold" onClick={promptInstall}>
								<DownloadIcon className="mr-2 h-5 w-5" />
								Install App Now
							</Button>
						) : isIOS ? (
							<div className="bg-card border-border flex w-full flex-col items-center gap-4 rounded-2xl border p-6 text-center shadow-sm">
								<div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
									<ShareIcon className="h-6 w-6" />
								</div>
								<div className="flex flex-col gap-1">
									<h2 className="text-foreground font-bold">iOS Installation</h2>
									<p className="text-muted-foreground text-sm leading-relaxed">
										To install on your iPhone or iPad, tap the <strong className="text-foreground">Share</strong> icon in your browser menu, then select <strong className="text-foreground">Add to Home Screen</strong>.
									</p>
								</div>
							</div>
						) : (
							<div className="bg-muted border-border flex w-full flex-col items-center gap-2 rounded-2xl border p-6 text-center">
								<h2 className="text-foreground font-bold">Browser Not Supported</h2>
								<p className="text-muted-foreground text-sm leading-relaxed">
									Your current browser doesn't support direct installation. Try using Chrome, Edge, or Safari on iOS.
								</p>
							</div>
						)}
					</div>
				</section>

				{/* Benefits Section */}
				<section className="mt-4 flex flex-col gap-6">
					<h2 className="text-foreground text-2xl font-semibold">Why install?</h2>
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
			<div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
				{icon}
			</div>
			<h3 className="text-foreground font-semibold">{title}</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
		</div>
	);
}
