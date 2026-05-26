import { describe, expect, it } from "vitest";

import { resolveHorizontalSwipe } from "#/hooks/useHorizontalSwipe";

describe("resolveHorizontalSwipe", () => {
	it("returns left when swiping left past the threshold", () => {
		expect(resolveHorizontalSwipe(-60, 10, 48)).toBe("left");
	});

	it("returns right when swiping right past the threshold", () => {
		expect(resolveHorizontalSwipe(60, -10, 48)).toBe("right");
	});

	it("returns null when horizontal movement is below the threshold", () => {
		expect(resolveHorizontalSwipe(30, 0, 48)).toBeNull();
		expect(resolveHorizontalSwipe(-47, 0, 48)).toBeNull();
	});

	it("returns null when vertical movement dominates", () => {
		expect(resolveHorizontalSwipe(-60, 80, 48)).toBeNull();
		expect(resolveHorizontalSwipe(60, -80, 48)).toBeNull();
	});
});
