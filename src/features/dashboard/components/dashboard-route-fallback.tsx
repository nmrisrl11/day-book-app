import { getHasDataHint } from "@/helpers/storage";
import { DashboardEmptyState } from "./dashboard-empty-state";
import { DashboardSkeleton } from "./dashboard-skeleton";

export function DashboardRouteFallback() {
	// Read the hint synchronously.
	// If it's missing (null) or false, we default to showing the EmptyState.
	// This makes it instant for new users.
	const hasDataHint = getHasDataHint();

	if (hasDataHint) {
		return <DashboardSkeleton />;
	}

	return <DashboardEmptyState disabled />;
}
