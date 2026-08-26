import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
	return (
		<div className="flex w-full flex-col items-center gap-16">
			{/* Hero / Happy Birthday Section */}
			<div className="relative z-10 flex min-h-[50vh] w-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] py-16 text-center">
				<Skeleton className="mb-8 h-16 w-[320px] rounded-xl sm:w-120 md:mb-12" />

				<div className="flex flex-col items-center gap-4 p-6">
					<Skeleton className="h-40 w-40 rounded-full" />

					<Skeleton className="h-8 w-35" />
				</div>
			</div>

			{/* Upcoming Birthdays Section */}
			<div className="w-full max-w-5xl space-y-4 overflow-hidden px-4 sm:px-6">
				<Skeleton className="h-7 w-62.5 rounded-lg" />

				<div className="flex w-max gap-4 p-4 pt-10 pb-6">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="border-border bg-card flex min-w-40 flex-col items-center rounded-3xl border p-6 shadow-sm md:min-w-45"
						>
							<div className="-mt-12 mb-4 p-1">
								<Skeleton className="h-16 w-16 rounded-full border-4 md:h-20 md:w-20" />
							</div>

							<Skeleton className="mb-2 h-6 w-20" />
							<Skeleton className="mb-4 h-4 w-24" />
							<Skeleton className="h-6 w-24 rounded-full" />
						</div>
					))}
				</div>
			</div>

			{/* Birthdays Grid Section */}
			<div className="flex w-full flex-col gap-6">
				<Skeleton className="h-8 w-50 rounded-lg" />

				<div className="grid grid-cols-2 gap-x-4 gap-y-6 px-2 md:grid-cols-4 md:gap-y-8 lg:grid-cols-6">
					{[...Array(12)].map((_, i) => (
						<div key={i} className="flex w-full flex-col gap-2">
							<Skeleton className="h-5 w-12" />
							<Skeleton className="h-14 w-full rounded-2xl" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
