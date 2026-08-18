import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
			<div className="flex flex-col gap-3">
				<Skeleton className="h-8 w-37.5" />
				<Skeleton className="h-4 w-50" />
			</div>

			<div className="flex flex-col gap-6 md:flex-row">
				{/* Left Sidebar Skeleton */}
				<div className="flex flex-col gap-6 md:w-64 md:shrink-0">
					<div className="flex w-full gap-3 overflow-hidden md:flex-col">
						<Skeleton className="h-10 w-32 shrink-0 rounded-md md:w-full" />
						<Skeleton className="h-10 w-32 shrink-0 rounded-md md:w-full" />
						<Skeleton className="h-10 w-32 shrink-0 rounded-md md:w-full" />
						<Skeleton className="h-10 w-32 shrink-0 rounded-md md:w-full" />
						<Skeleton className="h-10 w-32 shrink-0 rounded-md md:w-full" />
					</div>
				</div>

				{/* Right Content Skeleton */}
				<div className="min-w-0 flex-1">
					<div className="border-border bg-card flex flex-col gap-8 rounded-xl border p-6 shadow-sm">
						{/* Theme Section */}
						<div className="flex flex-col gap-3">
							<Skeleton className="h-6 w-25" />
							<div className="bg-accent flex h-10 w-full rounded-lg">
								<Skeleton className="h-full w-1/2 rounded-md" />
							</div>
						</div>

						{/* Display Settings Section */}
						<div className="flex flex-col gap-6 rounded-xl border p-4">
							<div className="flex flex-col gap-1.5">
								<div className="flex items-center justify-between gap-1.5">
									<Skeleton className="h-6 w-62.5" />
									<Skeleton className="h-4 w-4" />
								</div>

								<Skeleton className="h-4 w-full" />
							</div>

							<Skeleton className="h-10 w-full rounded-md" />

							{/* Preview */}
							<div className="bg-accent/30 flex flex-col gap-3 rounded-xl border p-3">
								<Skeleton className="h-3 w-16" />
								<div className="flex gap-4 overflow-hidden p-4 pt-8 pb-4">
									{[1, 2, 3, 4].map((i) => (
										<div
											key={i}
											className="bg-card relative flex min-w-28 flex-col items-center rounded-2xl border p-3 pt-8 shadow-sm md:min-w-32"
										>
											<Skeleton className="absolute -top-6 h-12 w-12 rounded-full border-[3px]" />
											<Skeleton className="mb-2 h-3 w-16 rounded-full" />
											<Skeleton className="mb-3 h-2 w-12 rounded-full" />
											<Skeleton className="h-4 w-20 rounded-full" />
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Toggle Section */}
						<div className="flex flex-col gap-1.5 rounded-xl border p-3">
							<div className="flex items-center justify-between gap-1.5">
								<Skeleton className="h-6 w-55" />
								<Skeleton className="h-6 w-11 rounded-full" />
							</div>

							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
