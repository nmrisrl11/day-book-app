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
		<div className="flex flex-col gap-3">
			<h3 className="flex items-center gap-2 text-base font-medium">
				<HardDriveIcon className="h-4 w-4" aria-hidden="true" />
				Storage Overview
			</h3>
			<div className="flex flex-col gap-3 rounded-xl border p-3">
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">Estimated Usage</span>
					<span className="text-sm font-medium">
						{storageUsage !== null ? formatBytes(storageUsage) : "Calculating..."}
					</span>
				</div>
				{storageQuota !== null && (
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-sm">Browser Quota Limit</span>
						<span className="text-sm font-medium">{formatBytes(storageQuota)}</span>
					</div>
				)}

				<div className="border-border/50 mt-1 flex flex-col gap-2 border-t pt-3">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-sm">Persistent Storage</span>
						<span className="text-sm font-medium">
							{isPersisted ? <span className="text-green-600">Enabled</span> : "Disabled"}
						</span>
					</div>
					{!isPersisted && (
						<div className="mt-1 flex flex-col gap-3 rounded-lg bg-amber-500/10 p-3">
							<p id="protection-desc" className="text-xs leading-relaxed text-amber-600">
								Your browser might automatically delete data if device storage runs low. Enable
								persistent storage to protect your birthdays from eviction.
							</p>
							<Button
								variant="warning"
								onClick={handleRequestPersist}
								title="Enable persistent storage protection"
								aria-label="Enable persistent storage protection"
								aria-describedby="protection-desc"
							>
								Enable Protection
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
