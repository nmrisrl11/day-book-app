import { useState, useEffect } from "react";

export function useActiveSection(itemIds: string[]) {
	const [activeId, setActiveId] = useState<string>("");

	const joinedIds = itemIds.join(",");

	useEffect(() => {
		const idsToTrack = joinedIds.split(",");

		const observer = new IntersectionObserver(
			(entries) => {
				const intersecting = entries.filter((e) => e.isIntersecting);
				if (intersecting.length > 0) {
					intersecting.forEach((entry) => {
						setActiveId(entry.target.id);
					});
				}
			},
			{ rootMargin: "-100px 0px -40% 0px" },
		);

		idsToTrack.forEach((id) => {
			if (!id) return;
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		});

		return () => {
			idsToTrack.forEach((id) => {
				if (!id) return;
				const element = document.getElementById(id);
				if (element) observer.unobserve(element);
			});
		};
	}, [joinedIds]);

	return activeId;
}
