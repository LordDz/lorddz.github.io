import {
	type CSSProperties,
	type ReactNode,
	type PointerEvent as ReactPointerEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import {
	getAbsentKeyVisualState,
	getActiveAndAbsentKeyboardLetters,
	type KeyboardLetterState,
} from "#/components/games/awesome-word/gameLogic";
import type { CategoryLanguage } from "#/data/awesome-word/types";

type GameKeyboardProps = {
	language: CategoryLanguage;
	submittedKeyboardState: Map<string, KeyboardLetterState>;
	keyboardState: Map<string, KeyboardLetterState>;
	currentRow: string[];
	isRowComplete: boolean;
	onKey: (key: string) => void;
	onEnter: () => void;
	onBackspace: () => void;
	disabled?: boolean;
	lossWord?: string | null;
};

const KEY_FLASH_MS = 180;

function keyFallStyle(index: number, colInRow: number, rowLength: number) {
	const seed = index * 11 + colInRow * 7;
	const centerCol = (rowLength - 1) / 2;
	const pushX = (colInRow - centerCol) * 30 + ((seed % 5) - 2) * 8;
	const pushY = -10 + ((seed % 4) - 2) * 5;

	return {
		"--aw-push-x": `${pushX}px`,
		"--aw-push-y": `${pushY}px`,
		"--aw-fall-x": `${((seed % 9) - 4) * 10}px`,
		"--aw-fall-rot": `${((seed % 7) - 3) * 22}deg`,
		"--aw-fall-delay": `${140 + (index % 9) * 40}ms`,
	} as CSSProperties;
}

function keyClass(
	state: KeyboardLetterState | undefined,
	isFalling: boolean,
	extraClasses: string[] = [],
): string {
	const classes = ["awesome-word-key", ...extraClasses];
	if (extraClasses.includes("is-letter")) {
		if (state === "correct") classes.push("is-correct");
		else if (state === "present") classes.push("is-present");
		else if (state === "absent") classes.push("is-absent");
		else if (state === "draft") classes.push("is-draft");
	}
	if (isFalling) classes.push("is-falling");
	return classes.join(" ");
}

function KeyboardButton({
	className,
	disabled,
	fallStyle,
	onActivate,
	children,
	"aria-label": ariaLabel,
}: {
	className: string;
	disabled: boolean;
	fallStyle?: CSSProperties;
	onActivate: () => void;
	children: ReactNode;
	"aria-label"?: string;
}) {
	const [flashed, setFlashed] = useState(false);
	const touchActivatedRef = useRef(false);
	const flashTimeoutRef = useRef<number | undefined>(undefined);

	useEffect(
		() => () => {
			if (flashTimeoutRef.current !== undefined) {
				window.clearTimeout(flashTimeoutRef.current);
			}
		},
		[],
	);

	const flash = useCallback(() => {
		setFlashed(true);
		if (flashTimeoutRef.current !== undefined) {
			window.clearTimeout(flashTimeoutRef.current);
		}
		flashTimeoutRef.current = window.setTimeout(
			() => setFlashed(false),
			KEY_FLASH_MS,
		);
	}, []);

	const activate = useCallback(() => {
		if (disabled) return;
		flash();
		onActivate();
	}, [disabled, flash, onActivate]);

	const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
		if (disabled || event.pointerType !== "touch") return;
		touchActivatedRef.current = true;
		event.preventDefault();
		activate();
	};

	const handleClick = () => {
		if (disabled) return;
		if (touchActivatedRef.current) {
			touchActivatedRef.current = false;
			return;
		}
		activate();
	};

	return (
		<button
			type="button"
			className={`${className}${flashed ? " is-flashed" : ""}`}
			style={fallStyle}
			onPointerDown={handlePointerDown}
			onClick={handleClick}
			disabled={disabled}
			aria-label={ariaLabel}
		>
			{children}
		</button>
	);
}

function KeyButton({
	letter,
	keyboardState,
	onKey,
	disabled,
	isFalling,
	fallStyle,
}: {
	letter: string;
	keyboardState: Map<string, KeyboardLetterState>;
	onKey: (key: string) => void;
	disabled: boolean;
	isFalling: boolean;
	fallStyle?: CSSProperties;
}) {
	return (
		<KeyboardButton
			className={keyClass(keyboardState.get(letter), isFalling, ["is-letter"])}
			disabled={disabled}
			fallStyle={fallStyle}
			onActivate={() => onKey(letter)}
		>
			{letter}
		</KeyboardButton>
	);
}

function AbsentKeyButton({
	letter,
	currentRow,
	onKey,
	disabled,
	isFalling,
	fallStyle,
}: {
	letter: string;
	currentRow: string[];
	onKey: (key: string) => void;
	disabled: boolean;
	isFalling: boolean;
	fallStyle?: CSSProperties;
}) {
	const visualState = getAbsentKeyVisualState(letter, currentRow);

	return (
		<KeyboardButton
			className={keyClass(visualState, isFalling, [
				"is-letter",
				"is-absent-key",
			])}
			disabled={disabled}
			fallStyle={fallStyle}
			onActivate={() => onKey(letter)}
		>
			{letter}
		</KeyboardButton>
	);
}

export default function GameKeyboard({
	language,
	submittedKeyboardState,
	keyboardState,
	currentRow,
	isRowComplete,
	onKey,
	onEnter,
	onBackspace,
	disabled = false,
	lossWord = null,
}: GameKeyboardProps) {
	const { activeRows, absentRows } = getActiveAndAbsentKeyboardLetters(
		language,
		submittedKeyboardState,
	);
	const hasAbsentKeys = absentRows.some((row) => row.length > 0);
	const isFalling = lossWord !== null;
	let keyIndex = 0;

	const submitClasses = ["awesome-word-key", "is-submit"]
		.concat(isFalling ? ["is-falling"] : [])
		.join(" ");
	const backspaceClasses = ["awesome-word-key", "is-backspace"]
		.concat(isFalling ? ["is-falling"] : [])
		.join(" ");

	return (
		<div
			className={`awesome-word-keyboard-stage${isFalling ? " is-loss-falling" : ""}`}
		>
			{lossWord && (
				<p
					className={`awesome-word-loss-word${lossWord.length > 5 ? " is-long" : ""}`}
					aria-live="polite"
				>
					{lossWord}
				</p>
			)}
			<div className="awesome-word-keyboard">
				{activeRows.map((row) => (
					<div
						key={row.join("")}
						className="awesome-word-keyboard-row"
						style={{ "--aw-row-key-count": row.length } as CSSProperties}
					>
						{row.map((letter, colIdx) => {
							const index = keyIndex++;
							return (
								<KeyButton
									key={letter}
									letter={letter}
									keyboardState={keyboardState}
									onKey={onKey}
									disabled={disabled}
									isFalling={isFalling}
									fallStyle={
										isFalling
											? keyFallStyle(index, colIdx, row.length)
											: undefined
									}
								/>
							);
						})}
					</div>
				))}
				{hasAbsentKeys && (
					<div className="awesome-word-keyboard-absent">
						{absentRows.map((row, rowIdx) =>
							row.length === 0 ? null : (
								<div
									key={`absent-row-${rowIdx}`}
									className="awesome-word-keyboard-row is-absent-row"
									style={{ "--aw-row-key-count": row.length } as CSSProperties}
								>
									{row.map((letter, colIdx) => {
										const index = keyIndex++;
										return (
											<AbsentKeyButton
												key={letter}
												letter={letter}
												currentRow={currentRow}
												onKey={onKey}
												disabled={disabled}
												isFalling={isFalling}
												fallStyle={
													isFalling
														? keyFallStyle(index, colIdx, row.length)
														: undefined
												}
											/>
										);
									})}
								</div>
							),
						)}
					</div>
				)}
				<div className="awesome-word-keyboard-row is-actions">
					<KeyboardButton
						className={submitClasses}
						disabled={disabled || !isRowComplete}
						fallStyle={isFalling ? keyFallStyle(keyIndex++, 0, 2) : undefined}
						onActivate={onEnter}
						aria-label="Skicka ord"
					>
						OK
					</KeyboardButton>
					<KeyboardButton
						className={backspaceClasses}
						disabled={disabled}
						fallStyle={isFalling ? keyFallStyle(keyIndex++, 1, 2) : undefined}
						onActivate={onBackspace}
						aria-label="Radera"
					>
						⌫
					</KeyboardButton>
				</div>
			</div>
		</div>
	);
}
