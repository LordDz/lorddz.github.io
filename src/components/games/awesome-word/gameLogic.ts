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

export function createInitialRow(
	wordLength: WordLength,
	lockedGreens: LockedGreens,
): string[] {
	return Array.from({ length: wordLength }, (_, i) => lockedGreens[i] ?? "");
}

export function insertLetter(row: string[], key: string): string[] {
	const next = [...row];
	const idx = next.indexOf("");
	if (idx === -1) return next;
	next[idx] = key;
	return next;
}

export function setLetterAt(
	row: string[],
	index: number,
	key: string,
): string[] {
	if (index < 0 || index >= row.length) return row;
	const next = [...row];
	next[index] = key;
	return next;
}

export function clearLetterAt(row: string[], index: number): string[] {
	if (index < 0 || index >= row.length) return row;
	const next = [...row];
	next[index] = "";
	return next;
}

export function deleteLetter(row: string[]): string[] {
	const next = [...row];
	for (let i = next.length - 1; i >= 0; i--) {
		if (next[i] !== "") {
			next[i] = "";
			break;
		}
	}
	return next;
}

export function rowToString(row: string[]): string {
	return row.join("");
}

export function isRowComplete(row: string[]): boolean {
	return row.every((char) => char !== "");
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
	["Z", "X", "C", "V", "B", "N", "M"],
] as const;

export const ENGLISH_KEYBOARD_ROWS = [
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L"],
	["Z", "X", "C", "V", "B", "N", "M"],
] as const;

export function getKeyboardRows(
	language: "sv" | "en",
): readonly (readonly string[])[] {
	return language === "sv" ? SWEDISH_KEYBOARD_ROWS : ENGLISH_KEYBOARD_ROWS;
}

export function getAllKeyboardLetters(language: "sv" | "en"): string[] {
	return getKeyboardRows(language).flat();
}

export function getActiveAndAbsentKeyboardLetters(
	language: "sv" | "en",
	keyboardState: Map<string, KeyboardLetterState>,
): { activeRows: string[][]; absentRows: (string | null)[][] } {
	const absentRows: (string | null)[][] = [];
	const activeRows = getKeyboardRows(language)
		.map((row) => {
			const activeRow: string[] = [];
			const absentRow: (string | null)[] = [];

			for (const letter of row) {
				if (keyboardState.get(letter) === "absent") {
					absentRow.push(letter);
				} else {
					activeRow.push(letter);
					absentRow.push(null);
				}
			}

			absentRows.push(absentRow);
			return activeRow;
		})
		.filter((row) => row.length > 0);

	return { activeRows, absentRows };
}
