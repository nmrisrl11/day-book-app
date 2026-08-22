import { Skeleton } from "@/components/ui/skeleton";

export function InstallSkeleton() {
	return (
		<div className="relative flex h-full flex-col">
			<div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 p-4 pt-4 pb-12 md:p-8">
				{/* Back button */}
				<div>
					<Skeleton className="h-8 w-32 rounded-md" />
				</div>

				{/* Hero Section */}
				<section className="flex flex-col items-center gap-4 text-center">
					<Skeleton className="mb-2 h-24 w-24 rounded-full" />
					<Skeleton className="h-6 w-24 rounded-full" />
					<Skeleton className="h-10 w-64 rounded-md" />
					<Skeleton className="h-16 w-full max-w-xl rounded-md" />

					{/* Action Area */}
					<div className="mt-4 flex w-full max-w-sm flex-col items-center gap-4">
						<Skeleton className="h-14 w-full rounded-md" />
					</div>
				</section>

				{/* Benefits Section */}
				<section className="mt-4 flex flex-col gap-6">
					<Skeleton className="h-8 w-48 rounded-md" />
					<div className="grid gap-4 sm:grid-cols-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-5"
							>
								<Skeleton className="h-10 w-10 rounded-xl" />
								<Skeleton className="h-6 w-3/4 rounded-md" />
								<Skeleton className="h-16 w-full rounded-md" />
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
