import { toJpeg } from "html-to-image";

import type { CategoryId } from "#/data/awesome-word/types";
import {
	addScreenshot,
	createScreenshotId,
	type ScreenshotEntry,
} from "#/stores/awesomeWordStore";

export async function captureGameScreenshot(
	element: HTMLElement,
	meta: {
		word: string;
		won: boolean;
		categoryId: CategoryId;
	},
): Promise<ScreenshotEntry | null> {
	try {
		const dataUrl = await toJpeg(element, {
			quality: 0.7,
			width: 400,
			pixelRatio: 2,
			backgroundColor: getComputedStyle(element).backgroundColor || "#121213",
		});

		const entry: ScreenshotEntry = {
			id: createScreenshotId(),
			dataUrl,
			timestamp: Date.now(),
			word: meta.word,
			won: meta.won,
			categoryId: meta.categoryId,
		};

		addScreenshot(entry);
		return entry;
	} catch {
		return null;
	}
}
