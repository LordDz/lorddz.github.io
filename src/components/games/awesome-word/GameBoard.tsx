import type { CSSProperties } from "react";

import type {
	GuessRow,
	LockedGreens,
} from "#/components/games/awesome-word/gameLogic";
import {
	buildCurrentRow,
	MAX_GUESSES,
} from "#/components/games/awesome-word/gameLogic";
import type { WordLength } from "#/data/awesome-word/types";

type GameBoardProps = {
	wordLength: WordLength;
	guesses: GuessRow[];
	currentInput: string;
	lockedGreens: LockedGreens;
	currentRowIndex: number;
	isFalling: boolean;
};

function fallStyle(row: number, col: number): CSSProperties {
	const seed = row * 11 + col * 7;
	return {
		"--aw-fall-x": `${((seed % 9) - 4) * 6}px`,
		"--aw-fall-rot": `${((seed % 7) - 3) * 14}deg`,
		"--aw-fall-delay": `${(seed % 5) * 40}ms`,
	} as CSSProperties;
}

function tileClass(state: string, extras: string[] = []): string {
	const classes = ["awesome-word-tile", ...extras];
	if (state === "correct") classes.push("is-correct");
	else if (state === "present") classes.push("is-present");
	else if (state === "absent") classes.push("is-absent");
	else if (state === "tbd") classes.push("is-filled");
	return classes.join(" ");
}

export default function GameBoard({
	wordLength,
	guesses,
	currentInput,
	lockedGreens,
	currentRowIndex,
	isFalling,
}: GameBoardProps) {
	const currentRow = buildCurrentRow(wordLength, lockedGreens, currentInput);
	const boardClass = isFalling
		? "awesome-word-board is-falling"
		: "awesome-word-board";

	return (
		<div className={boardClass}>
			{Array.from({ length: MAX_GUESSES }, (_, rowIdx) => {
				const isCurrent = rowIdx === currentRowIndex;
				const isPast = rowIdx < currentRowIndex;
				const guess = guesses[rowIdx];

				return (
					<div key={`row-${rowIdx}`} className="awesome-word-row">
						{Array.from({ length: wordLength }, (_, colIdx) => {
							let letter = "";
							let state = "empty";
							const isLockedGreen = Boolean(lockedGreens[colIdx]) && isCurrent;

							if (isPast && guess) {
								letter = guess.letters[colIdx] ?? "";
								state = guess.states[colIdx] ?? "empty";
							} else if (isCurrent) {
								letter = currentRow[colIdx] ?? "";
								state = letter ? "tbd" : "empty";
								if (lockedGreens[colIdx]) state = "correct";
							}

							const extras: string[] = [];
							if (isCurrent) extras.push("is-current");
							if (isLockedGreen) extras.push("is-locked");
							if (isFalling && letter) extras.push("is-falling");

							return (
								<div
									key={`col-${colIdx}`}
									className={tileClass(state, extras)}
									style={
										isFalling && letter ? fallStyle(rowIdx, colIdx) : undefined
									}
								>
									{letter}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
