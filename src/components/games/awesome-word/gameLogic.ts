import type { WordLength } from "#/data/awesome-word/types";

export type TileState = "empty" | "tbd" | "correct" | "present" | "absent";

export type KeyboardLetterState = "unused" | "correct" | "present" | "absent";

export type LockedGreens = Partial<Record<number, string>>;

export type GuessRow = {
	letters: string;
	states: TileState[];
};

export const MAX_GUESSES = 6;

export function evaluateGuess(guess: string, target: string): TileState[] {
	const normalizedGuess = guess.toUpperCase();
	const normalizedTarget = target.toUpperCase();
	const result: TileState[] = Array.from(
		{ length: normalizedTarget.length },
		() => "absent",
	);
	const targetChars = normalizedTarget.split("");
	const guessChars = normalizedGuess.split("");
	const remaining = [...targetChars];

	for (let i = 0; i < guessChars.length; i++) {
		if (guessChars[i] === targetChars[i]) {
			result[i] = "correct";
			remaining[i] = "";
		}
	}

	for (let i = 0; i < guessChars.length; i++) {
		if (result[i] === "correct") continue;
		const idx = remaining.indexOf(guessChars[i] ?? "");
		if (idx !== -1) {
			result[i] = "present";
			remaining[idx] = "";
		}
	}

	return result;
}

export function getLockedGreens(guesses: GuessRow[]): LockedGreens {
	const locked: LockedGreens = {};
	for (const row of guesses) {
		for (let i = 0; i < row.states.length; i++) {
			if (row.states[i] === "correct") {
				locked[i] = row.letters[i];
			}
		}
	}
	return locked;
}

export function getKeyboardState(
	guesses: GuessRow[],
): Map<string, KeyboardLetterState> {
	const map = new Map<string, KeyboardLetterState>();
	const priority: Record<KeyboardLetterState, number> = {
		unused: 0,
		absent: 1,
		present: 2,
		correct: 3,
	};

	for (const row of guesses) {
		for (let i = 0; i < row.letters.length; i++) {
			const letter = row.letters[i];
			if (!letter) continue;
			const tileState = row.states[i];
			let keyState: KeyboardLetterState = "unused";
			if (tileState === "correct") keyState = "correct";
			else if (tileState === "present") keyState = "present";
			else if (tileState === "absent") keyState = "absent";

			const current = map.get(letter) ?? "unused";
			if (priority[keyState] > priority[current]) {
				map.set(letter, keyState);
			}
		}
	}

	return map;
}

export function getVisibleKeyboardLetters(
	keyboardState: Map<string, KeyboardLetterState>,
	allLetters: readonly string[],
): string[] {
	return allLetters.filter((letter) => {
		const state = keyboardState.get(letter);
		return state !== "absent";
	});
}

export function buildCurrentRow(
	wordLength: WordLength,
	lockedGreens: LockedGreens,
	userInput: string,
): string {
	const chars = Array.from({ length: wordLength }, () => "");
	let inputIdx = 0;

	for (let i = 0; i < wordLength; i++) {
		const locked = lockedGreens[i];
		if (locked) {
			chars[i] = locked;
		} else if (inputIdx < userInput.length) {
			chars[i] = userInput[inputIdx] ?? "";
			inputIdx++;
		}
	}

	return chars.join("");
}

export function getEditableIndices(
	wordLength: WordLength,
	lockedGreens: LockedGreens,
): number[] {
	const indices: number[] = [];
	for (let i = 0; i < wordLength; i++) {
		if (!lockedGreens[i]) indices.push(i);
	}
	return indices;
}

export function isRowComplete(
	wordLength: WordLength,
	lockedGreens: LockedGreens,
	userInput: string,
): boolean {
	const row = buildCurrentRow(wordLength, lockedGreens, userInput);
	if (row.length !== wordLength) return false;
	return [...row].every((char) => char !== "");
}

export function calculateWinScore(
	attempts: number,
	wordLength: WordLength,
): number {
	return Math.max(1, (7 - attempts) * wordLength);
}

export function nextWordLength(current: WordLength): WordLength {
	if (current >= 7) return 7;
	return (current + 1) as WordLength;
}

export const SWEDISH_KEYBOARD_ROWS = [
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
] as const;

export const ENGLISH_KEYBOARD_ROWS = [
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L"],
] as const;

export function getKeyboardRows(
	language: "sv" | "en",
): readonly (readonly string[])[] {
	return language === "sv" ? SWEDISH_KEYBOARD_ROWS : ENGLISH_KEYBOARD_ROWS;
}

export function getAllKeyboardLetters(language: "sv" | "en"): string[] {
	return getKeyboardRows(language).flat();
}
