import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeftIcon } from "lucide-react";

export function PersonSkeleton() {
	return (
		<div className="flex w-full flex-col gap-6">
			{/* Back Button Skeleton */}
			<div className="flex items-center">
				<div className="text-muted-foreground flex h-9 w-24 items-center gap-1">
					<ChevronLeftIcon className="h-4 w-4" />
					<Skeleton className="h-4 w-12" />
				</div>
			</div>

			<div className="mx-auto flex w-full max-w-3xl flex-col gap-6 md:gap-8">
				{/* Header Card Skeleton */}
				<div className="bg-card border-border relative flex flex-col items-center overflow-visible rounded-3xl border px-6 pb-6 pt-0 text-center shadow-sm sm:px-8 sm:pb-8 mt-12 sm:mt-16">
					<div className="relative -mt-12 sm:-mt-16 mb-4">
						<div className="bg-card ring-border/50 relative z-10 rounded-full p-1.5 ring-1">
							<Skeleton className="h-24 w-24 rounded-full sm:h-28 sm:w-28" />
						</div>
					</div>

					<div className="mb-6 flex flex-col items-center gap-2">
						<Skeleton className="h-8 w-48 sm:h-10 sm:w-64" />
					</div>

					<div className="bg-secondary/30 border-border/40 w-full max-w-lg rounded-2xl border p-4 shadow-sm">
						<div className="flex justify-center gap-8">
							<div className="flex flex-col items-center gap-2">
								<Skeleton className="h-3 w-12" />
								<Skeleton className="h-5 w-24" />
							</div>
							<div className="flex flex-col items-center gap-2">
								<Skeleton className="h-3 w-12" />
								<Skeleton className="h-5 w-20" />
							</div>
							<div className="flex flex-col items-center gap-2">
								<Skeleton className="h-3 w-16" />
								<Skeleton className="h-5 w-20" />
							</div>
						</div>
					</div>

					<div className="mt-6 flex gap-3">
						<Skeleton className="h-10 w-32 rounded-md" />
						<Skeleton className="h-10 w-32 rounded-md" />
					</div>
				</div>

				{/* Content Grid Skeleton */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Gifts Skeleton */}
					<div className="bg-card border-border rounded-3xl border p-6">
						<div className="mb-4 flex items-center gap-2">
							<Skeleton className="h-5 w-5 rounded-full" />
							<Skeleton className="h-4 w-32" />
						</div>
						<div className="flex flex-wrap gap-2">
							<Skeleton className="h-8 w-28 rounded-full" />
							<Skeleton className="h-8 w-36 rounded-full" />
						</div>
					</div>

					{/* Notes Skeleton */}
					<div className="bg-card border-border rounded-3xl border p-6">
						<div className="mb-4 flex items-center gap-2">
							<Skeleton className="h-5 w-5 rounded-full" />
							<Skeleton className="h-4 w-24" />
						</div>
						<div className="flex flex-wrap gap-2">
							<Skeleton className="h-8 w-32 rounded-full" />
							<Skeleton className="h-8 w-40 rounded-full" />
							<Skeleton className="h-8 w-24 rounded-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
