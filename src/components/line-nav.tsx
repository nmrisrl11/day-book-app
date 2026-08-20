import { cn } from "@/lib/utils";

export type LineNavItem = {
	id: string;
	label: string;
	children?: LineNavItem[];
};

interface LineNavProps {
	items: LineNavItem[];
	activeId: string;
	className?: string;
	onItemClick?: () => void;
}

export function LineNav({ items, activeId, className, onItemClick }: LineNavProps) {
	return (
		<div className={cn("flex flex-col", className)}>
			<div className="flex flex-col gap-1 py-4 pr-0.5 pl-3">
				{items.map((item) => (
					<LineNavItemComponent
						key={item.id}
						item={item}
						activeId={activeId}
						onClick={onItemClick}
					/>
				))}
			</div>
		</div>
	);
}

function LineNavItemComponent({
	item,
	activeId,
	onClick,
}: {
	item: LineNavItem;
	activeId: string;
	onClick?: () => void;
}) {
	const isActive = activeId === item.id || item.children?.some((child) => child.id === activeId);

	return (
		<div className="flex flex-col">
			<a
				href={`#${item.id}`}
				onClick={onClick}
				className="group relative flex h-8 items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3"
			>
				<span
					className={cn(
						"group-hover:bg-foreground block h-px shrink-0 transition-all duration-300 ease-out",
						isActive ? "bg-foreground w-10" : "bg-foreground/20 w-6",
					)}
				/>
				<span
					className={cn(
						"group-hover:text-foreground text-sm whitespace-nowrap transition-colors duration-300 ease-out",
						isActive ? "text-foreground font-medium" : "text-muted-foreground",
					)}
				>
					{item.label}
				</span>
			</a>

			{item.children && (
				<div className="ml-2 flex flex-col">
					{item.children.map((child) => {
						const isChildActive = activeId === child.id;
						return (
							<a
								key={child.id}
								href={`#${child.id}`}
								onClick={onClick}
								className="group relative flex h-8 items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3"
							>
								<span
									className={cn(
										"group-hover:bg-foreground block h-px shrink-0 transition-all duration-300 ease-out",
										isChildActive ? "bg-foreground w-8" : "bg-foreground/20 w-4",
									)}
								/>
								<span
									className={cn(
										"group-hover:text-foreground text-sm whitespace-nowrap transition-colors duration-300 ease-out",
										isChildActive ? "text-foreground font-medium" : "text-muted-foreground",
									)}
								>
									{child.label}
								</span>
							</a>
						);
					})}
				</div>
			)}
		</div>
	);
}
