import { Button } from "@/components/ui/button";
import { HardDriveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { gooeyToast } from "goey-toast";

export function StorageInfo() {
	const [storageUsage, setStorageUsage] = useState<number | null>(null);
	const [storageQuota, setStorageQuota] = useState<number | null>(null);
	const [isPersisted, setIsPersisted] = useState(false);

	useEffect(() => {
		const checkStorage = async () => {
			if (navigator.storage && navigator.storage.estimate) {
				const estimate = await navigator.storage.estimate();
				setStorageUsage(estimate.usage || 0);
				setStorageQuota(estimate.quota || 0);
			}
			if (navigator.storage && navigator.storage.persisted) {
				const persisted = await navigator.storage.persisted();
				setIsPersisted(persisted);
			}
		};
		checkStorage();
	}, []);

	const handleRequestPersist = async () => {
		if (navigator.storage && navigator.storage.persist) {
			const persisted = await navigator.storage.persist();
			setIsPersisted(persisted);

			if (persisted) {
				gooeyToast.success("Protection Enabled", {
					description: "Your data is now protected from automatic browser eviction.",
					showTimestamp: false,
					classNames: {
						content: "items-center text-center",
						title: "text-center w-full",
						description: "text-center justify-center flex w-full",
					},
				});
			} else {
				gooeyToast.info("Action Required", {
					description:
						"Could not enable protection automatically. Try installing the app or bookmarking it, as browsers restrict this feature.",
					showTimestamp: false,
					classNames: {
						content: "items-center text-center",
						title: "text-center w-full",
						description: "text-center justify-center flex w-full",
					},
				});
			}
		} else {
			gooeyToast.error("Unsupported Browser", {
				description: "Storage persistence is not supported by your current browser.",
				showTimestamp: false,
				classNames: {
					content: "items-center text-center",
					title: "text-center w-full",
					description: "text-center justify-center flex w-full",
				},
			});
		}
	};

	const formatBytes = (bytes: number) => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	return (
		<div className="flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-col gap-1 pr-4">
				<div className="flex items-center gap-2">
					<h4 className="flex items-center gap-2 text-sm font-semibold">
						<HardDriveIcon className="h-4 w-4" aria-hidden="true" />
						Browser Storage
					</h4>
					{isPersisted ? (
						<span className="inline-flex items-center rounded-md border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-600 transition-colors">
							Protected
						</span>
					) : (
						<span className="inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 transition-colors">
							At Risk
						</span>
					)}
				</div>
				<p className="text-muted-foreground text-sm">
					{storageUsage !== null ? formatBytes(storageUsage) : "Calculating..."} used
					{storageQuota ? ` of ${formatBytes(storageQuota)} limit` : ""}
				</p>
			</div>
			<div className="mt-2 flex w-full shrink-0 items-center gap-2 sm:mt-0 sm:w-auto">
				{!isPersisted && (
					<Button
						variant="warning"
						size="sm"
						onClick={handleRequestPersist}
						title="Enable persistent storage protection"
						aria-label="Enable persistent storage protection"
						className="w-full sm:w-auto"
					>
						Enable Protection
					</Button>
				)}
			</div>
		</div>
	);
}
