import { Skeleton } from "@/components/ui/skeleton";

export function AboutSkeleton() {
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
					<Skeleton className="h-12 w-3/4 max-w-md rounded-md" />
					<Skeleton className="h-20 w-full max-w-xl rounded-md" />
				</section>

				{/* Features Section */}
				<section className="flex flex-col gap-6">
					<Skeleton className="h-8 w-48 rounded-md" />
					<div className="grid gap-4 sm:grid-cols-2">
						{Array.from({ length: 6 }).map((_, i) => (
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

				{/* Privacy Section */}
				<section className="bg-card border-border flex flex-col gap-4 rounded-3xl border p-6 sm:p-8">
					<div className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 rounded-full" />
						<Skeleton className="h-8 w-64 rounded-md" />
					</div>
					<Skeleton className="h-24 w-full rounded-md" />
					<Skeleton className="h-20 w-full rounded-md" />
				</section>

				{/* Open Source Section */}
				<section className="bg-card border-border flex flex-col gap-4 rounded-3xl border p-6 sm:p-8">
					<div className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 rounded-full" />
						<Skeleton className="h-8 w-40 rounded-md" />
					</div>
					<Skeleton className="h-20 w-full rounded-md" />
					<Skeleton className="mt-2 h-10 w-64 rounded-md" />
				</section>

				{/* Community Section */}
				<section className="bg-card border-border flex flex-col gap-4 rounded-3xl border p-6 sm:p-8">
					<div className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 rounded-full" />
						<Skeleton className="h-8 w-48 rounded-md" />
					</div>
					<Skeleton className="h-20 w-full rounded-md" />
					<Skeleton className="mt-2 h-10 w-64 rounded-md" />
				</section>

				{/* Changelog Section */}
				<section className="flex flex-col gap-8">
					<Skeleton className="h-8 w-40 rounded-md" />
					<div className="flex flex-col gap-12">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex flex-col gap-4 md:flex-row md:gap-8">
								{/* Date & Version */}
								<div className="flex flex-col gap-1 md:w-32 md:shrink-0 md:text-right">
									<Skeleton className="h-5 w-24 rounded-md md:ml-auto" />
									<Skeleton className="h-4 w-16 rounded-md md:ml-auto" />
								</div>

								{/* Timeline Items */}
								<div className="flex w-full flex-col gap-4">
									<Skeleton className="h-8 w-64 rounded-md" />
									<Skeleton className="mb-2 h-16 w-full rounded-md" />

									<div className="border-border ml-2 flex flex-col gap-6 border-l pl-6 md:ml-0 md:pl-4">
										{Array.from({ length: 2 }).map((_, j) => (
											<div key={j} className="relative flex flex-col gap-2">
												<div className="bg-border absolute top-2 left-[-28.5px] h-2 w-2 rounded-full md:left-[-20.5px]" />
												<div className="flex items-center gap-2">
													<Skeleton className="h-5 w-16 rounded-full" />
													<Skeleton className="h-6 w-48 rounded-md" />
												</div>
												<Skeleton className="h-12 w-full rounded-md" />
											</div>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
