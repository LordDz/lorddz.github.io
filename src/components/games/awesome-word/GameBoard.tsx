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
	shakingRow: number | null;
};

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
	shakingRow,
}: GameBoardProps) {
	const currentRow = buildCurrentRow(wordLength, lockedGreens, currentInput);

	return (
		<div className="awesome-word-board">
			{Array.from({ length: MAX_GUESSES }, (_, rowIdx) => {
				const isCurrent = rowIdx === currentRowIndex;
				const isPast = rowIdx < currentRowIndex;
				const guess = guesses[rowIdx];
				const shake =
					shakingRow === rowIdx
						? "awesome-word-row is-shaking"
						: "awesome-word-row";

				return (
					<div key={`row-${rowIdx}`} className={shake}>
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

							return (
								<div key={`col-${colIdx}`} className={tileClass(state, extras)}>
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
