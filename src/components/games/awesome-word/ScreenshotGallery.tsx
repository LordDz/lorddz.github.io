import { useHotkeys } from "@tanstack/react-hotkeys";
import { useStore } from "@tanstack/react-store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { CategoryId } from "#/data/awesome-word/types";
import { useHorizontalSwipe } from "#/hooks/useHorizontalSwipe";
import { awesomeWordStore } from "#/stores/awesomeWordStore";

import "#/components/games/awesome-word/awesome-word.css";

type ScreenshotGalleryProps = {
	categoryId?: CategoryId;
	variant?: "inline" | "page";
};

function formatTimestamp(timestamp: number): string {
	return new Date(timestamp).toLocaleString(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

export default function ScreenshotGallery({
	categoryId,
	variant = "inline",
}: ScreenshotGalleryProps) {
	const { screenshots } = useStore(awesomeWordStore);
	const filtered = categoryId
		? screenshots.filter((shot) => shot.categoryId === categoryId)
		: screenshots;
	const [index, setIndex] = useState(0);

	useEffect(() => {
		setIndex((current) => Math.min(current, Math.max(0, filtered.length - 1)));
	}, [filtered.length]);

	const goPrev = useCallback(() => {
		setIndex((current) => (current <= 0 ? filtered.length - 1 : current - 1));
	}, [filtered.length]);

	const goNext = useCallback(() => {
		setIndex((current) => (current >= filtered.length - 1 ? 0 : current + 1));
	}, [filtered.length]);

	const swipeHandlers = useHorizontalSwipe({
		onSwipeLeft: goNext,
		onSwipeRight: goPrev,
		enabled: variant === "page" && filtered.length > 1,
	});

	useHotkeys(
		[
			{
				hotkey: "ArrowLeft",
				callback: goPrev,
				options: { preventDefault: true },
			},
			{
				hotkey: "ArrowRight",
				callback: goNext,
				options: { preventDefault: true },
			},
		],
		{ enabled: variant === "page" && filtered.length > 1 },
	);

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

	if (variant === "page") {
		const active = filtered[index];

		return (
			<section className={sectionClass}>
				<div className="awesome-word-gallery-carousel-header">
					<h3 className="text-[var(--sea-ink)] normal-case">
						{filtered.length} saved round{filtered.length === 1 ? "" : "s"}
					</h3>
					{filtered.length > 1 && (
						<p className="awesome-word-gallery-counter">
							{index + 1} / {filtered.length}
						</p>
					)}
				</div>

				<div
					className="awesome-word-gallery-carousel island-shell rise-in overflow-hidden rounded-[1.5rem] px-4 py-5 sm:px-6 sm:py-6"
					{...swipeHandlers}
				>
					<div className="awesome-word-gallery-slide-wrap">
						<img
							src={active.dataUrl}
							alt={`AwesomeWord round: ${active.word}`}
							className="awesome-word-gallery-slide"
						/>
					</div>

					<div className="awesome-word-gallery-meta">
						<p className="awesome-word-gallery-meta-word">
							<span
								className={
									active.won
										? "awesome-word-gallery-result is-won"
										: "awesome-word-gallery-result is-lost"
								}
							>
								{active.won ? "Won" : "Lost"}
							</span>
							<span className="awesome-word-gallery-word">{active.word}</span>
						</p>
						<p className="awesome-word-gallery-meta-date">
							{formatTimestamp(active.timestamp)}
						</p>
					</div>

					{filtered.length > 1 && (
						<div className="awesome-word-gallery-controls">
							<button
								type="button"
								onClick={goPrev}
								className="awesome-word-gallery-nav"
								aria-label="Previous screenshot"
							>
								<ChevronLeft size={20} />
								Prev
							</button>
							<p className="awesome-word-gallery-swipe-hint">
								<span className="sm:hidden">Swipe to browse</span>
								<span className="hidden sm:inline">
									Use <kbd className="awesome-word-gallery-kbd">←</kbd>{" "}
									<kbd className="awesome-word-gallery-kbd">→</kbd>
								</span>
							</p>
							<button
								type="button"
								onClick={goNext}
								className="awesome-word-gallery-nav"
								aria-label="Next screenshot"
							>
								Next
								<ChevronRight size={20} />
							</button>
						</div>
					)}
				</div>
			</section>
		);
	}

	return (
		<section className={sectionClass}>
			<h3>Round history</h3>
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
