import { describe, expect, it } from "vitest";

import {
	clearLetterAt,
	createInitialRow,
	deleteLetter,
	evaluateGuess,
	getAbsentKeyVisualState,
	getActiveAndAbsentKeyboardLetters,
	getDisplayKeyboardState,
	getKeyboardState,
	getLockedGreens,
	insertLetter,
	isRowComplete,
	rowToString,
	setLetterAt,
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

describe("editable green auto-fill", () => {
	it("prefills green positions on a new row", () => {
		const guesses = [
			{
				letters: "LASER",
				states: ["correct", "absent", "absent", "absent", "absent"],
			},
		];
		const locked = getLockedGreens(guesses);
		expect(createInitialRow(5, locked)).toEqual(["L", "", "", "", ""]);
	});

	it("detects complete rows with prefilled greens", () => {
		const row = createInitialRow(5, { 0: "L" });
		expect(
			isRowComplete(
				insertLetter(
					insertLetter(insertLetter(insertLetter(row, "A"), "S"), "E"),
					"R",
				),
			),
		).toBe(true);
		expect(isRowComplete(insertLetter(insertLetter(row, "A"), "S"))).toBe(
			false,
		);
	});

	it("allows clearing prefilled greens with backspace", () => {
		const row = createInitialRow(5, { 0: "L" });
		const filled = insertLetter(
			insertLetter(insertLetter(insertLetter(row, "A"), "S"), "E"),
			"R",
		);
		expect(rowToString(filled)).toBe("LASER");

		const clearedGreen = deleteLetter(filled);
		expect(clearedGreen).toEqual(["L", "A", "S", "E", ""]);
		const noGreen = deleteLetter(clearedGreen);
		expect(noGreen).toEqual(["L", "A", "S", "", ""]);
		const allGone = deleteLetter(deleteLetter(deleteLetter(noGreen)));
		expect(allGone).toEqual(["", "", "", "", ""]);
	});

	it("replaces a letter at a selected position", () => {
		const row = ["H", "E", "L", "L", "O"];
		expect(setLetterAt(row, 2, "X")).toEqual(["H", "E", "X", "L", "O"]);
		expect(clearLetterAt(row, 4)).toEqual(["H", "E", "L", "L", ""]);
	});
});

describe("keyboard state", () => {
	it("marks absent letters as black instead of removing them", () => {
		const guesses = [
			{
				letters: "LASER",
				states: ["correct", "absent", "absent", "absent", "absent"],
			},
		];
		const state = getKeyboardState(guesses);
		expect(state.get("L")).toBe("correct");
		expect(state.get("A")).toBe("absent");
		expect(state.get("S")).toBe("absent");
		expect(state.get("E")).toBe("absent");
		expect(state.get("R")).toBe("absent");
	});

	it("groups absent letters by keyboard row without column gaps", () => {
		const guesses = [
			{
				letters: "LASER",
				states: ["correct", "absent", "absent", "absent", "absent"],
			},
		];
		const state = getKeyboardState(guesses);
		const { activeRows, absentRows } = getActiveAndAbsentKeyboardLetters(
			"en",
			state,
		);

		expect(absentRows).toHaveLength(3);
		expect(absentRows[0]).toEqual(["E", "R"]);
		expect(absentRows[1]).toEqual(["A", "S"]);
		expect(absentRows[2]).toEqual([]);
		expect(activeRows.flat()).toContain("L");
		expect(activeRows.flat()).not.toContain("S");
	});
});

describe("display keyboard state", () => {
	it("marks unused draft letters as draft", () => {
		const state = getDisplayKeyboardState([], ["", "H", "E", "", ""]);
		expect(state.get("H")).toBe("draft");
		expect(state.get("E")).toBe("draft");
		expect(state.get("L")).toBeUndefined();
	});

	it("keeps correct and present colors for draft letters", () => {
		const guesses = [
			{
				letters: "HELLO",
				states: ["correct", "present", "absent", "absent", "absent"],
			},
		];
		const state = getDisplayKeyboardState(guesses, ["H", "E", "", "", ""]);
		expect(state.get("H")).toBe("correct");
		expect(state.get("E")).toBe("present");
	});
});

describe("absent key highlighting", () => {
	it("marks absent keys in the current row as draft", () => {
		expect(getAbsentKeyVisualState("A", ["L", "A", "", "", ""])).toBe("draft");
		expect(getAbsentKeyVisualState("A", ["L", "", "", "", ""])).toBe("absent");
	});

	it("keeps absent letters in the absent rows while typing them", () => {
		const guesses = [
			{
				letters: "LASER",
				states: ["correct", "absent", "absent", "absent", "absent"],
			},
		];
		const submitted = getKeyboardState(guesses);
		const { activeRows, absentRows } = getActiveAndAbsentKeyboardLetters(
			"en",
			submitted,
		);

		expect(absentRows[1]).toEqual(["A", "S"]);
		expect(activeRows.flat()).not.toContain("A");
		expect(getAbsentKeyVisualState("A", ["L", "A", "", "", ""])).toBe("draft");
	});
});
