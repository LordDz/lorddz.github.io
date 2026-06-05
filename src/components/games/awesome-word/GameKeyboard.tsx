import {
	getActiveAndAbsentKeyboardLetters,
	type KeyboardLetterState,
} from "#/components/games/awesome-word/gameLogic";
import type { CategoryLanguage } from "#/data/awesome-word/types";

type GameKeyboardProps = {
	language: CategoryLanguage;
	keyboardState: Map<string, KeyboardLetterState>;
	isRowComplete: boolean;
	onKey: (key: string) => void;
	onEnter: () => void;
	onBackspace: () => void;
	disabled?: boolean;
};

function keyClass(state: KeyboardLetterState | undefined): string {
	const classes = ["awesome-word-key", "is-letter"];
	if (state === "correct") classes.push("is-correct");
	else if (state === "present") classes.push("is-present");
	else if (state === "absent") classes.push("is-absent");
	return classes.join(" ");
}

function KeyButton({
	letter,
	keyboardState,
	onKey,
	disabled,
}: {
	letter: string;
	keyboardState: Map<string, KeyboardLetterState>;
	onKey: (key: string) => void;
	disabled: boolean;
}) {
	return (
		<button
			type="button"
			className={keyClass(keyboardState.get(letter))}
			onClick={() => onKey(letter)}
			disabled={disabled}
		>
			{letter}
		</button>
	);
}

export default function GameKeyboard({
	language,
	keyboardState,
	isRowComplete,
	onKey,
	onEnter,
	onBackspace,
	disabled = false,
}: GameKeyboardProps) {
	const { activeRows, absentRows } = getActiveAndAbsentKeyboardLetters(
		language,
		keyboardState,
	);
	const hasAbsentKeys = absentRows.some((row) =>
		row.some((slot) => slot !== null),
	);
	const submitClasses = ["awesome-word-key", "is-submit"].join(" ");

	return (
		<div className="awesome-word-keyboard">
			{activeRows.map((row) => (
				<div key={row.join("")} className="awesome-word-keyboard-row">
					{row.map((letter) => (
						<KeyButton
							key={letter}
							letter={letter}
							keyboardState={keyboardState}
							onKey={onKey}
							disabled={disabled}
						/>
					))}
				</div>
			))}
			{hasAbsentKeys && (
				<div className="awesome-word-keyboard-absent">
					{absentRows.map((row, rowIdx) => (
						<div
							key={`absent-row-${rowIdx}`}
							className="awesome-word-keyboard-row is-absent-row"
						>
							{row.map((letter, colIdx) =>
								letter ? (
									<KeyButton
										key={letter}
										letter={letter}
										keyboardState={keyboardState}
										onKey={onKey}
										disabled={disabled}
									/>
								) : (
									<span
										key={`absent-spacer-${rowIdx}-${colIdx}`}
										className="awesome-word-key-spacer"
										aria-hidden
									/>
								),
							)}
						</div>
					))}
				</div>
			)}
			<div className="awesome-word-keyboard-row is-actions">
				<button
					type="button"
					className={submitClasses}
					onClick={onEnter}
					disabled={disabled || !isRowComplete}
					aria-label="Skicka ord"
				>
					OK
				</button>
				<button
					type="button"
					className="awesome-word-key is-backspace"
					onClick={onBackspace}
					disabled={disabled}
					aria-label="Radera"
				>
					⌫
				</button>
			</div>
		</div>
	);
}
