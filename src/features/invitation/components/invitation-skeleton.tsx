import { Skeleton } from "@/components/ui/skeleton";

export function InvitationSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-md flex-col gap-6 pt-10 pb-20">
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				<Skeleton className="mb-2 h-16 w-16 rounded-full" />
				<Skeleton className="h-8 w-3/4" />
				<Skeleton className="mt-2 h-5 w-5/6" />
			</div>

			<div className="bg-card flex flex-col gap-6 rounded-xl border p-4 shadow-sm md:p-6">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-10 w-full" />
				</div>

				<div className="flex flex-col gap-2">
					<Skeleton className="h-5 w-48" />
					<Skeleton className="h-10 w-full" />
				</div>

				<Skeleton className="mt-2 h-10 w-full" />
			</div>
		</div>
	);
}
