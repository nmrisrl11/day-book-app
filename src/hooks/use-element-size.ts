import { useCallback, useEffect, useState } from "react";

interface Size {
	width: number;
	height: number;
}

// Global ResizeObserver instance to prevent memory leaks and overhead
// from creating multiple observers (e.g., 12 instances for 12 MonthCards).
let globalObserver: ResizeObserver | null = null;
const observerCallbacks = new Map<Element, (entry: ResizeObserverEntry) => void>();

const getGlobalObserver = () => {
	if (typeof window === "undefined") return null;
	if (!globalObserver) {
		globalObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const callback = observerCallbacks.get(entry.target);
				if (callback) {
					callback(entry);
				}
			}
		});
	}
	return globalObserver;
};

export function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
	(node: T | null) => void,
	Size,
] {
	const [ref, setRef] = useState<T | null>(null);
	const [size, setSize] = useState<Size>({
		width: 0,
		height: 0,
	});

	const handleSize = useCallback(() => {
		if (ref) {
			setSize((prev) => {
				const newWidth = ref.offsetWidth;
				const newHeight = ref.offsetHeight;
				if (prev.width === newWidth && prev.height === newHeight) return prev;
				return { width: newWidth, height: newHeight };
			});
		}
	}, [ref]);

	useEffect(() => {
		if (!ref) {
			return;
		}

		handleSize();

		const observer = getGlobalObserver();
		if (!observer) return;

		const callback = (entry: ResizeObserverEntry) => {
			setSize((prev) => {
				// Use contentRect for the width excluding padding
				const newWidth = entry.contentRect.width;
				const newHeight = entry.contentRect.height;
				// Bail out of state update if size hasn't changed to prevent re-renders
				if (prev.width === newWidth && prev.height === newHeight) {
					return prev;
				}
				return { width: newWidth, height: newHeight };
			});
		};

		observerCallbacks.set(ref, callback);
		observer.observe(ref);

		return () => {
			observerCallbacks.delete(ref);
			observer.unobserve(ref);
		};
	}, [ref, handleSize]);

	return [setRef, size];
}
