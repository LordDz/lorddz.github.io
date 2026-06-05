import type { CSSProperties } from "react";

import type {
	GuessRow,
	LockedGreens,
} from "#/components/games/awesome-word/gameLogic";
import { MAX_GUESSES } from "#/components/games/awesome-word/gameLogic";
import type { WordLength } from "#/data/awesome-word/types";

type GameBoardProps = {
	wordLength: WordLength;
	guesses: GuessRow[];
	currentRow: string[];
	lockedGreens: LockedGreens;
	currentRowIndex: number;
	isFalling: boolean;
	selectedIndex: number | null;
	onSelectTile: (index: number) => void;
	inputLocked: boolean;
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
	currentRow,
	lockedGreens,
	currentRowIndex,
	isFalling,
	selectedIndex,
	onSelectTile,
	inputLocked,
}: GameBoardProps) {
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

							if (isPast && guess) {
								letter = guess.letters[colIdx] ?? "";
								state = guess.states[colIdx] ?? "empty";
							} else if (isCurrent) {
								letter = currentRow[colIdx] ?? "";
								if (letter) {
									state = lockedGreens[colIdx] === letter ? "correct" : "tbd";
								}
							}

							const extras: string[] = [];
							if (isCurrent) extras.push("is-current");
							if (isCurrent && selectedIndex === colIdx) {
								extras.push("is-selected");
							}
							if (isFalling && letter) extras.push("is-falling");

							const className = tileClass(state, extras);
							const style =
								isFalling && letter ? fallStyle(rowIdx, colIdx) : undefined;

							if (isCurrent && !inputLocked && !isFalling) {
								return (
									<button
										key={`col-${colIdx}`}
										type="button"
										className={className}
										style={style}
										onClick={() => onSelectTile(colIdx)}
										aria-label={`Position ${colIdx + 1}${letter ? `: ${letter}` : ""}`}
										aria-pressed={selectedIndex === colIdx}
									>
										{letter}
									</button>
								);
							}

							return (
								<div key={`col-${colIdx}`} className={className} style={style}>
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
