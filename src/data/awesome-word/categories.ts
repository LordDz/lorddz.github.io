import type {
	AwesomeWordCategory,
	CategoryId,
	WordLength,
	WordListByLength,
} from "#/data/awesome-word/types";
import { wordsFish } from "#/data/awesome-word/words-fish";
import { wordsGameTitles } from "#/data/awesome-word/words-game-titles";
import { wordsScience } from "#/data/awesome-word/words-science";

export const awesomeWordCategories: AwesomeWordCategory[] = [
	{
		id: "science",
		name: "Science",
		description: "Swedish science terms",
		imageUrl: "/games/science.svg",
		language: "sv",
	},
	{
		id: "fish",
		name: "Fish species",
		description: "Swedish fish names",
		imageUrl: "/games/fish.svg",
		language: "sv",
	},
	{
		id: "game-titles",
		name: "Game Titles",
		description: "English video game names",
		imageUrl: "/games/game-titles.svg",
		language: "en",
	},
];

const wordLists: Record<CategoryId, WordListByLength> = {
	science: wordsScience,
	fish: wordsFish,
	"game-titles": wordsGameTitles,
};

export function getWordList(categoryId: CategoryId): WordListByLength {
	return wordLists[categoryId];
}

export function getCategoryById(categoryId: CategoryId): AwesomeWordCategory {
	const category = awesomeWordCategories.find((c) => c.id === categoryId);
	if (!category) {
		throw new Error(`Unknown category: ${categoryId}`);
	}
	return category;
}

export function normalizeWord(word: string): string {
	return word.toUpperCase().trim();
}

export function getWordsForLength(
	categoryId: CategoryId,
	length: WordLength,
): readonly string[] {
	return getWordList(categoryId)[length].map((w) => normalizeWord(w));
}

export function isValidCategoryWord(
	categoryId: CategoryId,
	length: WordLength,
	word: string,
): boolean {
	return getWordsForLength(categoryId, length).includes(normalizeWord(word));
}

export function pickRandomWord(
	categoryId: CategoryId,
	length: WordLength,
	exclude: readonly string[] = [],
): string {
	const pool = getWordsForLength(categoryId, length).filter(
		(w) => !exclude.includes(w),
	);
	if (pool.length === 0) {
		return getWordsForLength(categoryId, length)[0] ?? "LASER";
	}
	return pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
}
