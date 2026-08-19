import { Skeleton } from "@/components/ui/skeleton";

export function ManageBirthdaysSkeleton() {
	return (
		<div className="flex w-full flex-col gap-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-62.5 rounded-lg" />

				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-12 rounded-lg sm:w-32" />
					<Skeleton className="h-8 w-12 rounded-lg sm:w-32" />
				</div>
			</div>

			<div className="flex flex-col gap-4">
				{/* Filters / Search */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<Skeleton className="h-8 w-full rounded-lg sm:flex-1" />
					<div className="flex flex-wrap items-center gap-2">
						<Skeleton className="h-8 w-32 rounded-lg" />
						<Skeleton className="h-8 w-40 rounded-lg" />
						<Skeleton className="h-8 w-10 rounded-lg" />
					</div>
				</div>

				{/* List Items */}
				<div className="flex flex-col gap-3">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div
							key={i}
							className="bg-card flex items-center justify-between rounded-xl border p-4 shadow-sm"
						>
							<div className="flex items-center gap-4">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex flex-col gap-1.5">
									<Skeleton className="h-5 w-32" />
									<Skeleton className="h-4 w-24" />
								</div>
							</div>
							<div className="flex items-center gap-1.5 sm:gap-3">
								<Skeleton className="h-5 w-5" />
								<Skeleton className="h-5 w-5" />
								<Skeleton className="h-5 w-5" />
							</div>
						</div>
					))}
				</div>

				{/* Pagination Footer */}
				<div className="mt-2 flex flex-col items-center justify-between gap-4 sm:flex-row">
					<div className="flex items-center gap-2">
						<Skeleton className="h-8 w-12" />
						<Skeleton className="h-8 w-16 rounded-md" />
						<Skeleton className="h-8 w-12" />
					</div>
					<Skeleton className="h-8 w-64 rounded-md" />
				</div>
			</div>
		</div>
	);
}
