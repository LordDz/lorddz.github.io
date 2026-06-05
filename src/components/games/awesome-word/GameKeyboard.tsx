import {
	getAllKeyboardLetters,
	getKeyboardRows,
	getVisibleKeyboardLetters,
	type KeyboardLetterState,
} from "#/components/games/awesome-word/gameLogic";
import type { CategoryLanguage } from "#/data/awesome-word/types";

type GameKeyboardProps = {
	language: CategoryLanguage;
	keyboardState: Map<string, KeyboardLetterState>;
	submitLabel: "OK" | "🤨";
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

export default function GameKeyboard({
	language,
	keyboardState,
	submitLabel,
	isRowComplete,
	onKey,
	onEnter,
	onBackspace,
	disabled = false,
}: GameKeyboardProps) {
	const allLetters = getAllKeyboardLetters(language);
	const visibleLetters = new Set(
		getVisibleKeyboardLetters(keyboardState, allLetters),
	);
	const rows = getKeyboardRows(language);
	const submitClasses = [
		"awesome-word-key",
		"is-submit",
		submitLabel === "🤨" ? "is-invalid" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className="awesome-word-keyboard">
			{rows.map((row) => (
				<div key={row.join("")} className="awesome-word-keyboard-row">
					{row
						.filter((letter) => visibleLetters.has(letter))
						.map((letter) => (
							<button
								key={letter}
								type="button"
								className={keyClass(keyboardState.get(letter))}
								onClick={() => onKey(letter)}
								disabled={disabled}
							>
								{letter}
							</button>
						))}
				</div>
			))}
			<div className="awesome-word-keyboard-row is-actions">
				<button
					type="button"
					className={submitClasses}
					onClick={onEnter}
					disabled={disabled || !isRowComplete}
					aria-label={submitLabel === "OK" ? "Skicka ord" : "Ogiltigt ord"}
				>
					{submitLabel}
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
