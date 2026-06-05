import { useStore } from "@tanstack/react-store";

import type { CategoryId } from "#/data/awesome-word/types";
import { awesomeWordStore } from "#/stores/awesomeWordStore";

import "#/components/games/awesome-word/awesome-word.css";

type ScreenshotGalleryProps = {
	categoryId?: CategoryId;
	variant?: "inline" | "page";
};

export default function ScreenshotGallery({
	categoryId,
	variant = "inline",
}: ScreenshotGalleryProps) {
	const { screenshots } = useStore(awesomeWordStore);
	const filtered = categoryId
		? screenshots.filter((shot) => shot.categoryId === categoryId)
		: screenshots;

	if (filtered.length === 0) {
		if (variant === "page") {
			return (
				<section className="awesome-word-gallery is-page mt-10">
					<p className="awesome-word-message">
						No saved rounds in this category yet. Play AwesomeWord and finish a
						round to capture a screenshot here.
					</p>
				</section>
			);
		}

		return null;
	}

	const sectionClass =
		variant === "page"
			? "awesome-word-gallery is-page mt-10"
			: "awesome-word-gallery";

	return (
		<section className={sectionClass}>
			{variant === "inline" && <h3>Round history</h3>}
			{variant === "page" && (
				<h3 className="text-[var(--sea-ink)] normal-case">
					{filtered.length} saved round{filtered.length === 1 ? "" : "s"}
				</h3>
			)}
			<div className="awesome-word-gallery-grid">
				{filtered.map((shot) => (
					<button
						key={shot.id}
						type="button"
						className="awesome-word-gallery-thumb"
						title={`${shot.won ? "Won" : "Lost"}: ${shot.word}`}
						onClick={() => {
							const win = window.open("");
							if (win) {
								win.document.write(
									`<img src="${shot.dataUrl}" alt="AwesomeWord round" style="max-width:100%" />`,
								);
							}
						}}
					>
						<img src={shot.dataUrl} alt="" />
					</button>
				))}
			</div>
		</section>
	);
}
