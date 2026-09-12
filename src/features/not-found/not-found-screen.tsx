import { AnimatedLogo } from "@/components/icons/animated-logo";
import { SEO } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { SettingsIcon, UsersIcon } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function NotFoundScreen() {
	return (
		<>
			<SEO title="Page Not Found" robots="noindex" />
			<main className="flex min-h-[75vh] flex-col items-center justify-center space-y-8 p-6 text-center">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", bounce: 0.5 }}
					className="flex justify-center"
				>
					<AnimatedLogo
						variant="404"
						type="icon"
						className="h-24 w-24 sm:h-32 sm:w-32"
						iconClassName="h-full w-full"
						autoPlay
					/>
				</motion.div>

				<div className="space-y-3">
					<h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
						Lost in time?
					</h1>
					<p className="mx-auto max-w-md text-lg text-muted-foreground">
						It seems this page has gone missing. Don't worry, even the best memories get misplaced
						sometimes.
					</p>
				</div>

				<Button asChild size="lg" className="mt-4 transition-shadow hover:shadow-md">
					<Link to="/">Back to Dashboard</Link>
				</Button>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="w-full max-w-md border-t border-border pt-8"
				>
					<p className="mb-4 text-sm font-medium text-muted-foreground">
						You might want to explore
					</p>
					<div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
						<Link
							to="/manage"
							className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						>
							<div className="rounded-lg bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
								<UsersIcon className="h-5 w-5" />
							</div>
							<div>
								<h3 className="mb-1 leading-none font-semibold tracking-tight">Manage</h3>
								<p className="text-xs text-muted-foreground">View your list</p>
							</div>
						</Link>

						<Link
							to="/settings"
							className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						>
							<div className="rounded-lg bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
								<SettingsIcon className="h-5 w-5" />
							</div>
							<div>
								<h3 className="mb-1 leading-none font-semibold tracking-tight">Settings</h3>
								<p className="text-xs text-muted-foreground">Personalize app</p>
							</div>
						</Link>
					</div>
				</motion.div>
			</main>
		</>
	);
}
