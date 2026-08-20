import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import type { Birthday } from "@/types/birthday";
import { useEffect, useState } from "react";

const DUMMY_VISITORS: Pick<Birthday, "name" | "avatar">[] = [
	{ name: "Visitor A" },
	{ name: "Visitor B" },
	{ name: "Visitor C" },
	{ name: "Visitor D" },
];

interface VisitorTrackerProps {
	className?: string;
}

export function VisitorTracker({ className }: VisitorTrackerProps) {
	const [stats, setStats] = useState({ total: 0 });
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			if (import.meta.env.DEV) {
				setStats({ total: 42 }); // fake count in dev
				setIsLoading(false);
				return;
			}

			try {
				const res = await fetch("/api/visitors");
				if (res.ok) {
					const data = await res.json();
					setStats({
						total: data.total || 0,
					});
				}
			} catch (_err) {
				// Silently fail if API is unavailable
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, []);

	// Don't render until app have a real count (this prevents 0 flash)
	if (isLoading || stats.total === 0) return null;

	return (
		<div
			className={cn(
				"border-border bg-background flex w-max items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5 text-xs",
				className,
			)}
		>
			<div className="pointer-events-none flex -space-x-2.5">
				{DUMMY_VISITORS.map((visitor, idx) => (
					<div key={idx} className="ring-background relative rounded-full ring-2">
						<UserAvatar birthday={visitor} size={24} />
					</div>
				))}
			</div>

			<span>
				<strong className="text-foreground">{stats.total.toLocaleString()}</strong> visitors
			</span>
		</div>
	);
}
