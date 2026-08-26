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
						<div className="bg-card flex flex-col rounded-xl border">
							<div className="bg-muted/30 flex flex-col gap-1.5 rounded-t-xl border-b p-4">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-4 w-48 max-w-[85%]" />
							</div>
							<div className="flex flex-col p-4">
								<div className="bg-muted/50 flex h-10 w-full rounded-lg p-1">
									<Skeleton className="h-full w-1/2 rounded-md" />
								</div>
							</div>
						</div>

						{/* Display Settings Section */}
						<div className="bg-card flex flex-col rounded-xl border">
							<div className="bg-muted/30 flex flex-col gap-1.5 rounded-t-xl border-b p-4">
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-4 w-64 max-w-[85%]" />
							</div>
							<div className="flex flex-col px-4">
								{/* Item 1 */}
								<div className="flex flex-col gap-2 border-b py-4">
									<div className="flex items-center justify-between gap-4">
										<Skeleton className="h-5 w-60" />
										<Skeleton className="h-8 w-24 rounded-md" />
									</div>
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<Skeleton className="h-10 w-72 sm:max-w-[85%]" />
										<div className="flex shrink-0 items-center">
											<Skeleton className="h-10 w-24 rounded-lg" />
										</div>
									</div>
								</div>

								{/* Item 2 */}
								<div className="flex flex-col gap-1 border-b py-4">
									<div className="flex items-center justify-between gap-4">
										<Skeleton className="h-5 w-48" />
										<div className="flex shrink-0 items-center">
											<Skeleton className="h-6 w-11 rounded-full" />
										</div>
									</div>
									<Skeleton className="h-4 w-72 max-w-[85%]" />
								</div>

								{/* Item 3 */}
								<div className="flex flex-col gap-1 py-4">
									<div className="flex items-center justify-between gap-4">
										<Skeleton className="h-5 w-48" />
										<div className="flex shrink-0 items-center">
											<Skeleton className="h-6 w-11 rounded-full" />
										</div>
									</div>
									<Skeleton className="h-4 w-72 max-w-[85%]" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
