import { Store } from "@tanstack/store";

import type { CategoryId, WordLength } from "#/data/awesome-word/types";

const STORAGE_KEY = "awesome-word-state";
const MAX_SCREENSHOTS = 15;
export const WINS_TO_LEVEL_UP = 5;

export type ScreenshotEntry = {
	id: string;
	dataUrl: string;
	timestamp: number;
	word: string;
	won: boolean;
	categoryId: CategoryId;
};

export type AwesomeWordState = {
	score: number;
	streak: number;
	wordLength: WordLength;
	winsAtLength: number;
	categoryId: CategoryId | null;
	screenshots: ScreenshotEntry[];
};

const defaultState: AwesomeWordState = {
	score: 0,
	streak: 0,
	wordLength: 5,
	winsAtLength: 0,
	categoryId: null,
	screenshots: [],
};

function isWordLength(value: unknown): value is WordLength {
	return value === 5 || value === 6 || value === 7;
}

function isCategoryId(value: unknown): value is CategoryId {
	return value === "science" || value === "fish" || value === "game-titles";
}

function isScreenshotEntry(value: unknown): value is ScreenshotEntry {
	if (!value || typeof value !== "object") return false;
	const entry = value as Record<string, unknown>;
	return (
		typeof entry.id === "string" &&
		typeof entry.dataUrl === "string" &&
		typeof entry.timestamp === "number" &&
		typeof entry.word === "string" &&
		typeof entry.won === "boolean" &&
		isCategoryId(entry.categoryId)
	);
}

function readStoredState(): AwesomeWordState | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
			return null;

		const data = parsed as Record<string, unknown>;
		const screenshots = Array.isArray(data.screenshots)
			? data.screenshots.filter(isScreenshotEntry)
			: [];

		return {
			score: typeof data.score === "number" ? data.score : 0,
			streak: typeof data.streak === "number" ? data.streak : 0,
			wordLength: isWordLength(data.wordLength) ? data.wordLength : 5,
			winsAtLength:
				typeof data.winsAtLength === "number" ? data.winsAtLength : 0,
			categoryId:
				data.categoryId === null
					? null
					: isCategoryId(data.categoryId)
						? data.categoryId
						: null,
			screenshots,
		};
	} catch {
		return null;
	}
}

function writeStoredState(state: AwesomeWordState) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const awesomeWordStore = new Store<AwesomeWordState>(defaultState);

if (typeof window !== "undefined") {
	const stored = readStoredState();
	if (stored) {
		awesomeWordStore.setState(() => stored);
	}
}

export function persistAwesomeWordState(state: AwesomeWordState) {
	writeStoredState(state);
}

export function setCategory(categoryId: CategoryId) {
	awesomeWordStore.setState((prev) => {
		const next = { ...prev, categoryId };
		persistAwesomeWordState(next);
		return next;
	});
}

export function recordWin(attempts: number, wordLength: WordLength) {
	awesomeWordStore.setState((prev) => {
		const points = Math.max(1, (7 - attempts) * wordLength);
		const nextWins = prev.winsAtLength + 1;
		const leveledUp = nextWins >= WINS_TO_LEVEL_UP && prev.wordLength < 7;
		const next: AwesomeWordState = {
			...prev,
			score: prev.score + points,
			streak: prev.streak + 1,
			winsAtLength: leveledUp ? 0 : nextWins,
			wordLength: leveledUp
				? ((prev.wordLength + 1) as WordLength)
				: prev.wordLength,
		};
		persistAwesomeWordState(next);
		return next;
	});
}

export function recordLoss() {
	awesomeWordStore.setState((prev) => {
		const next = { ...prev, streak: 0 };
		persistAwesomeWordState(next);
		return next;
	});
}

export function addScreenshot(entry: ScreenshotEntry) {
	awesomeWordStore.setState((prev) => {
		const screenshots = [entry, ...prev.screenshots].slice(0, MAX_SCREENSHOTS);
		const next = { ...prev, screenshots };
		persistAwesomeWordState(next);
		return next;
	});
}

export function resetProgress() {
	awesomeWordStore.setState(() => {
		persistAwesomeWordState(defaultState);
		return defaultState;
	});
}

export function createScreenshotId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
