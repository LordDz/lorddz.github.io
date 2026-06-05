import { useStore } from "@tanstack/react-store";
import { useCallback, useEffect, useRef, useState } from "react";

import CategoryPicker from "#/components/games/awesome-word/CategoryPicker";
import GameBoard from "#/components/games/awesome-word/GameBoard";
import GameKeyboard from "#/components/games/awesome-word/GameKeyboard";
import {
	clearLetterAt,
	createInitialRow,
	deleteLetter,
	evaluateGuess,
	type GuessRow,
	getKeyboardState,
	getLockedGreens,
	insertLetter,
	isRowComplete,
	rowToString,
	setLetterAt,
} from "#/components/games/awesome-word/gameLogic";
import ScoreBar from "#/components/games/awesome-word/ScoreBar";
import { captureGameScreenshot } from "#/components/games/awesome-word/screenshot";
import {
	getCategoryById,
	pickRandomWord,
} from "#/data/awesome-word/categories";
import type { CategoryId, WordLength } from "#/data/awesome-word/types";
import {
	awesomeWordStore,
	persistAwesomeWordState,
	recordLoss,
	recordWin,
	setCategory,
} from "#/stores/awesomeWordStore";

import "#/components/games/awesome-word/awesome-word.css";

type GamePhase = "category" | "playing";

type RoundState = {
	target: string;
	guesses: GuessRow[];
	currentRow: string[];
	currentRowIndex: number;
};

function emptyRow(wordLength: WordLength): string[] {
	return Array.from({ length: wordLength }, () => "");
}

function createRound(
	categoryId: CategoryId,
	wordLength: WordLength,
): RoundState {
	return {
		target: pickRandomWord(categoryId, wordLength),
		guesses: [],
		currentRow: emptyRow(wordLength),
		currentRowIndex: 0,
	};
}

export default function AwesomeWordGame() {
	const storeState = useStore(awesomeWordStore);
	const [phase, setPhase] = useState<GamePhase>("category");
	const [round, setRound] = useState<RoundState>(() =>
		createRound("science", 5),
	);
	const [isAnimating, setIsAnimating] = useState(false);
	const [isFalling, setIsFalling] = useState(false);
	const [message, setMessage] = useState("");
	const [debugWordRevealed, setDebugWordRevealed] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const boardRef = useRef<HTMLDivElement>(null);

	const category = storeState.categoryId
		? getCategoryById(storeState.categoryId)
		: null;
	const wordLength = storeState.wordLength;
	const lockedGreens = getLockedGreens(round.guesses);
	const keyboardState = getKeyboardState(round.guesses);
	const rowComplete = isRowComplete(round.currentRow);
	const inputLocked = isAnimating || isFalling;

	const startRound = useCallback(
		(catId: CategoryId, length: WordLength, exclude: string[] = []) => {
			setRound({
				target: pickRandomWord(catId, length, exclude),
				guesses: [],
				currentRow: emptyRow(length),
				currentRowIndex: 0,
			});
			setMessage("");
			setDebugWordRevealed(false);
			setSelectedIndex(null);
		},
		[],
	);

	const handleCategorySelect = (catId: CategoryId) => {
		setCategory(catId);
		awesomeWordStore.setState((prev) => {
			const next = {
				...prev,
				categoryId: catId,
				wordLength: 5 as WordLength,
				winsAtLength: 0,
			};
			persistAwesomeWordState(next);
			return next;
		});
		startRound(catId, 5);
		setPhase("playing");
	};

	const FALL_ANIMATION_MS = 1200;

	const finishRound = useCallback(
		async (
			won: boolean,
			attempts: number,
			target: string,
			catId: CategoryId,
		) => {
			if (!boardRef.current) return;

			await captureGameScreenshot(boardRef.current, {
				word: target,
				won,
				categoryId: catId,
			});

			if (won) {
				setIsFalling(true);
				setTimeout(() => {
					recordWin(attempts, wordLength);
					const nextLength = awesomeWordStore.state.wordLength;
					startRound(catId, nextLength, [target]);
					setIsFalling(false);
					setIsAnimating(false);
				}, FALL_ANIMATION_MS);
			} else {
				recordLoss();
				alert(`Aj, tråkigt, ordet var: ${target}`);
				startRound(catId, wordLength, [target]);
			}
		},
		[wordLength, startRound],
	);

	const submitGuess = useCallback(() => {
		if (
			inputLocked ||
			phase !== "playing" ||
			!category ||
			!storeState.categoryId
		)
			return;

		const row = rowToString(round.currentRow);
		if (!isRowComplete(round.currentRow)) return;

		setIsAnimating(true);
		const states = evaluateGuess(row, round.target);
		const newGuess: GuessRow = { letters: row, states };
		const newGuesses = [...round.guesses, newGuess];
		const attempts = newGuesses.length;
		const won = row === round.target;
		const lost = !won && attempts >= 6;
		const target = round.target;
		const catId = storeState.categoryId;

		setRound((prev) => ({
			...prev,
			guesses: newGuesses,
			currentRow: createInitialRow(wordLength, getLockedGreens(newGuesses)),
			currentRowIndex: prev.currentRowIndex + 1,
		}));
		setSelectedIndex(null);

		setTimeout(() => {
			if (won) {
				void finishRound(true, attempts, target, catId);
			} else {
				setIsAnimating(false);
				if (lost) {
					void finishRound(false, attempts, target, catId);
				}
			}
		}, 600);
	}, [
		inputLocked,
		phase,
		category,
		storeState.categoryId,
		wordLength,
		round,
		finishRound,
	]);

	const handleKey = useCallback(
		(key: string) => {
			if (inputLocked || phase !== "playing") return;

			setRound((prev) => {
				if (selectedIndex !== null) {
					return {
						...prev,
						currentRow: setLetterAt(prev.currentRow, selectedIndex, key),
					};
				}
				if (!prev.currentRow.some((char) => char === "")) return prev;
				return {
					...prev,
					currentRow: insertLetter(prev.currentRow, key),
				};
			});
			if (selectedIndex !== null) {
				setSelectedIndex(null);
			}
			setMessage("");
		},
		[inputLocked, phase, selectedIndex],
	);

	const handleBackspace = useCallback(() => {
		if (inputLocked || phase !== "playing") return;
		setRound((prev) => ({
			...prev,
			currentRow:
				selectedIndex !== null
					? clearLetterAt(prev.currentRow, selectedIndex)
					: deleteLetter(prev.currentRow),
		}));
	}, [inputLocked, phase, selectedIndex]);

	const handleSelectTile = useCallback(
		(index: number) => {
			if (inputLocked || phase !== "playing") return;
			setSelectedIndex(index);
		},
		[inputLocked, phase],
	);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (phase !== "playing" || inputLocked) return;

			if (e.key === "Enter") {
				e.preventDefault();
				submitGuess();
				return;
			}

			if (e.key === "Backspace") {
				e.preventDefault();
				handleBackspace();
				return;
			}

			const key = e.key.toUpperCase();
			const lang = category?.language ?? "sv";
			const allowed =
				lang === "sv" ? /^[A-ZÅÄÖ]$/.test(key) : /^[A-Z]$/.test(key);

			if (allowed) {
				e.preventDefault();
				handleKey(key);
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [phase, inputLocked, category, submitGuess, handleBackspace, handleKey]);

	return (
		<div className="awesome-word">
			<div ref={boardRef} className="awesome-word-shell">
				<h1 className="awesome-word-title">AwesomeWord</h1>

				{phase === "category" ? (
					<>
						<p className="awesome-word-message">
							Välj en kategori för att börja
						</p>
						<CategoryPicker onSelect={handleCategorySelect} />
					</>
				) : (
					<>
						<ScoreBar categoryId={storeState.categoryId} />
						<GameBoard
							wordLength={wordLength}
							guesses={round.guesses}
							currentRow={round.currentRow}
							lockedGreens={lockedGreens}
							currentRowIndex={round.currentRowIndex}
							isFalling={isFalling}
							selectedIndex={selectedIndex}
							onSelectTile={handleSelectTile}
							inputLocked={inputLocked}
						/>
						{message && <p className="awesome-word-message">{message}</p>}
						{category && (
							<GameKeyboard
								language={category.language}
								keyboardState={keyboardState}
								isRowComplete={rowComplete}
								onKey={handleKey}
								onEnter={submitGuess}
								onBackspace={handleBackspace}
								disabled={inputLocked}
							/>
						)}
						<button
							type="button"
							className="awesome-word-change-category"
							onClick={() => setPhase("category")}
						>
							change category
						</button>
						<div className="awesome-word-debug">
							<button
								type="button"
								className="awesome-word-debug-btn"
								onClick={() => setDebugWordRevealed(true)}
							>
								Visa ord (debug)
							</button>
							{debugWordRevealed && (
								<p className="awesome-word-debug-word">{round.target}</p>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
