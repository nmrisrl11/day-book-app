import { useState } from "react";

export function useDragScroll() {
	const [isDragging, setIsDragging] = useState(false);
	const [hasDragged, setHasDragged] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	const getScrollContainer = (element: HTMLElement) => {
		return element.parentElement as HTMLElement;
	};

	const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const container = getScrollContainer(e.currentTarget);
		if (!container) return;
		setIsDragging(true);
		setHasDragged(false);
		setStartX(e.pageX - container.offsetLeft);
		setScrollLeft(container.scrollLeft);
	};

	const onMouseLeave = () => {
		setIsDragging(false);
	};

	const onMouseUp = () => {
		setIsDragging(false);
	};

	const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isDragging) return;
		const container = getScrollContainer(e.currentTarget);
		if (!container) return;
		e.preventDefault();
		const x = e.pageX - container.offsetLeft;
		const walk = (x - startX) * 2;
		if (Math.abs(walk) > 10) {
			setHasDragged(true);
		}
		container.scrollLeft = scrollLeft - walk;
	};

	return {
		isDragging,
		hasDragged,
		handlers: {
			onMouseDown,
			onMouseLeave,
			onMouseUp,
			onMouseMove,
		},
	};
}
