import { describe, expect, it } from "vitest";

import {
	buildCurrentRow,
	evaluateGuess,
	getKeyboardState,
	getLockedGreens,
	getVisibleKeyboardLetters,
	isRowComplete,
} from "#/components/games/awesome-word/gameLogic";

describe("evaluateGuess", () => {
	it("marks correct and present letters", () => {
		expect(evaluateGuess("HELLO", "WORLD")).toEqual([
			"absent",
			"absent",
			"absent",
			"correct",
			"present",
		]);
	});

	it("handles duplicate letters", () => {
		expect(evaluateGuess("SPEED", "ERASE")).toEqual([
			"present",
			"absent",
			"present",
			"present",
			"absent",
		]);
	});
});

describe("locked greens and auto-fill", () => {
	it("locks green positions across rows", () => {
		const guesses = [
			{
				letters: "LASER",
				states: ["correct", "absent", "absent", "absent", "absent"],
			},
		];
		expect(getLockedGreens(guesses)).toEqual({ 0: "L" });
		expect(buildCurrentRow(5, getLockedGreens(guesses), "ASER")).toBe("LASER");
	});

	it("detects complete rows with locked letters", () => {
		const locked = { 0: "L" };
		expect(isRowComplete(5, locked, "ASER")).toBe(true);
		expect(isRowComplete(5, locked, "ASE")).toBe(false);
	});
});

describe("keyboard filtering", () => {
	it("hides absent letters", () => {
		const guesses = [
			{
				letters: "LASER",
				states: ["correct", "absent", "absent", "absent", "absent"],
			},
		];
		const state = getKeyboardState(guesses);
		const visible = getVisibleKeyboardLetters(state, [
			"A",
			"B",
			"L",
			"S",
			"E",
			"R",
		]);
		expect(visible).not.toContain("S");
		expect(visible).not.toContain("E");
		expect(visible).not.toContain("R");
		expect(visible).toContain("L");
	});
});
