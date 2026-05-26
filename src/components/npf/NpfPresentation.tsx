import { useHotkeys } from "@tanstack/react-hotkeys";
import { useCallback, useEffect, useState } from "react";
import { npfContentSlides, npfSlideCount } from "#/data/npf-slides";
import NpfContentSlide from "./NpfContentSlide";
import NpfSpeakerNotes from "./NpfSpeakerNotes";
import NpfSplashSlide from "./NpfSplashSlide";
import {
	enterNpfFullscreenIfRequested,
	setNpfPresentingChrome,
} from "./npf-fullscreen";
import { npfSlideHasAudio } from "./npf-slide-audio";
import "./npf-presentation.css";

export default function NpfPresentation() {
	const [slideIndex, setSlideIndex] = useState(0);
	const [notesOpen, setNotesOpen] = useState(false);
	const [notesHintDismissed, setNotesHintDismissed] = useState(false);
	const [audioPausedBySlide, setAudioPausedBySlide] = useState<
		Record<number, boolean>
	>({});

	const isSplash = slideIndex === 0;
	const contentIndex = slideIndex - 1;
	const activeContent =
		contentIndex >= 0 ? npfContentSlides[contentIndex] : undefined;

	const syncChromeWithFullscreen = useCallback(() => {
		setNpfPresentingChrome(Boolean(document.fullscreenElement));
	}, []);

	useEffect(() => {
		void enterNpfFullscreenIfRequested().then((entered) => {
			if (entered) {
				setNpfPresentingChrome(true);
			}
		});

		const onFullscreenChange = () => {
			syncChromeWithFullscreen();
		};

		document.addEventListener("fullscreenchange", onFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", onFullscreenChange);
			setNpfPresentingChrome(false);
			if (document.fullscreenElement) {
				void document.exitFullscreen().catch(() => {});
			}
		};
	}, [syncChromeWithFullscreen]);

	const goNext = useCallback(() => {
		setSlideIndex((i) => Math.min(i + 1, npfSlideCount - 1));
	}, []);

	const goPrev = useCallback(() => {
		setSlideIndex((i) => Math.max(i - 1, 0));
	}, []);

	const toggleNotes = useCallback(() => {
		if (isSplash) {
			return;
		}
		setNotesOpen((open) => {
			if (!open) {
				setNotesHintDismissed(true);
			}
			return !open;
		});
	}, [isSplash]);

	const toggleSlideAudio = useCallback(() => {
		if (!npfSlideHasAudio(slideIndex)) {
			return;
		}
		setAudioPausedBySlide((prev) => ({
			...prev,
			[slideIndex]: !prev[slideIndex],
		}));
	}, [slideIndex]);

	const currentSlideAudioPaused = audioPausedBySlide[slideIndex] ?? false;

	useHotkeys(
		[
			{
				hotkey: "ArrowRight",
				callback: goNext,
				options: { preventDefault: true },
			},
			{
				hotkey: "ArrowLeft",
				callback: goPrev,
				options: { preventDefault: true },
			},
			{
				hotkey: "b",
				callback: toggleNotes,
				options: { preventDefault: true },
			},
			{
				hotkey: "B",
				callback: toggleNotes,
				options: { preventDefault: true },
			},
			{
				hotkey: "Space",
				callback: toggleSlideAudio,
				options: { preventDefault: true },
			},
		],
		{ enabled: true },
	);

	useEffect(() => {
		if (isSplash) {
			setNotesOpen(false);
		}
	}, [isSplash]);

	return (
		<div className="npf-deck relative min-h-dvh w-full overflow-hidden bg-[var(--bg-base)]">
			<div className="relative min-h-dvh w-full">
				<div
					className={`npf-slide-layer absolute inset-0 ${slideIndex === 0 ? "is-active" : "is-inactive"}`}
					aria-hidden={slideIndex !== 0}
				>
					<NpfSplashSlide
						isActive={slideIndex === 0}
						audioPaused={slideIndex === 0 && currentSlideAudioPaused}
					/>
				</div>

				{npfContentSlides.map((slide, i) => {
					const index = i + 1;
					const isActive = slideIndex === index;
					return (
						<div
							key={slide.id}
							className={`npf-slide-layer absolute inset-0 ${isActive ? "is-active" : "is-inactive"}`}
							aria-hidden={!isActive}
						>
							<NpfContentSlide
								slide={slide}
								isActive={isActive}
								audioPaused={isActive && currentSlideAudioPaused}
								showNotesHint={index === 1 && !notesHintDismissed && !notesOpen}
							/>
						</div>
					);
				})}
			</div>

			{!isSplash && activeContent ? (
				<NpfSpeakerNotes
					open={notesOpen}
					text={activeContent.speakerNotes}
					onClose={() => setNotesOpen(false)}
				/>
			) : null}

			<div
				className="pointer-events-none fixed bottom-4 right-4 z-[150] rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--sea-ink-soft)] opacity-60"
				aria-hidden
			>
				{slideIndex + 1} / {npfSlideCount}
			</div>
		</div>
	);
}
