import { useStore } from "@tanstack/react-store";

import type { CategoryId } from "#/data/awesome-word/types";
import { awesomeWordStore } from "#/stores/awesomeWordStore";

const SCORE_ICONS: Record<CategoryId, string> = {
	fish: "🐟",
	"game-titles": "🕹",
	science: "🧪",
};

type ScoreBarProps = {
	categoryId: CategoryId | null;
};

export default function ScoreBar({ categoryId }: ScoreBarProps) {
	const { score, streak } = useStore(awesomeWordStore);
	const scoreIcon = categoryId ? SCORE_ICONS[categoryId] : "🧪";

	return (
		<div className="awesome-word-scorebar">
			<span className="awesome-word-scorebar-item">{streak} ✨</span>
			<span className="awesome-word-scorebar-item">
				{scoreIcon} {score}
			</span>
		</div>
	);
}
