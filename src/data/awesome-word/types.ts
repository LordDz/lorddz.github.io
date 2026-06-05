export type WordLength = 5 | 6 | 7;

export type WordListByLength = Record<WordLength, readonly string[]>;

export type CategoryId = "science" | "fish" | "game-titles";

export type CategoryLanguage = "sv" | "en";

export type AwesomeWordCategory = {
	id: CategoryId;
	name: string;
	description: string;
	imageUrl: string;
	language: CategoryLanguage;
};
