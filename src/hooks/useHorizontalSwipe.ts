import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useRef } from "react";

export type HorizontalSwipeDirection = "left" | "right";

const DEFAULT_THRESHOLD = 48;

export function resolveHorizontalSwipe(
	dx: number,
	dy: number,
	threshold = DEFAULT_THRESHOLD,
): HorizontalSwipeDirection | null {
	if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) {
		return null;
	}

	return dx < 0 ? "left" : "right";
}

type UseHorizontalSwipeOptions = {
	onSwipeLeft: () => void;
	onSwipeRight: () => void;
	enabled?: boolean;
	threshold?: number;
};

type SwipeHandlers = {
	onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
	onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
	onPointerCancel: () => void;
};

export function useHorizontalSwipe({
	onSwipeLeft,
	onSwipeRight,
	enabled = true,
	threshold = DEFAULT_THRESHOLD,
}: UseHorizontalSwipeOptions): SwipeHandlers {
	const startRef = useRef<{ x: number; y: number } | null>(null);

	const onPointerDown = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			if (!enabled || event.pointerType !== "touch") {
				return;
			}

			startRef.current = { x: event.clientX, y: event.clientY };
		},
		[enabled],
	);

	const onPointerUp = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			if (!enabled || event.pointerType !== "touch" || !startRef.current) {
				return;
			}

			const dx = event.clientX - startRef.current.x;
			const dy = event.clientY - startRef.current.y;
			startRef.current = null;

			const direction = resolveHorizontalSwipe(dx, dy, threshold);
			if (direction === "left") {
				onSwipeLeft();
			} else if (direction === "right") {
				onSwipeRight();
			}
		},
		[enabled, onSwipeLeft, onSwipeRight, threshold],
	);

	const onPointerCancel = useCallback(() => {
		startRef.current = null;
	}, []);

	return { onPointerDown, onPointerUp, onPointerCancel };
}
