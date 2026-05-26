import { useEffect, useRef } from "react";

import { NPF_PRESENTATION_VOLUME } from "./npf-audio";

const TICKING_CLOCK_SRC = `${import.meta.env.BASE_URL}npf/ticking-clock.mp3`;
const PAUSE_MS = 4000;

type Props = {
	isActive: boolean;
	userPaused: boolean;
};

function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") {
		return false;
	}
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Tick → 4s silence → repeat. Only runs when slide is active. */
export default function NpfTickingClockAudio({ isActive, userPaused }: Props) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) {
			return;
		}

		const clearPauseTimeout = () => {
			if (pauseTimeoutRef.current !== null) {
				clearTimeout(pauseTimeoutRef.current);
				pauseTimeoutRef.current = null;
			}
		};

		const stopPlayback = () => {
			clearPauseTimeout();
			audio.pause();
			audio.currentTime = 0;
		};

		const playTick = () => {
			audio.volume = NPF_PRESENTATION_VOLUME;
			audio.currentTime = 0;
			void audio.play().catch(() => {});
		};

		const scheduleReplay = () => {
			clearPauseTimeout();
			pauseTimeoutRef.current = setTimeout(() => {
				pauseTimeoutRef.current = null;
				if (!isActive || prefersReducedMotion()) {
					return;
				}
				playTick();
			}, PAUSE_MS);
		};

		const onEnded = () => {
			scheduleReplay();
		};

		if (!isActive || prefersReducedMotion()) {
			stopPlayback();
			audio.removeEventListener("ended", onEnded);
			return;
		}

		if (userPaused) {
			clearPauseTimeout();
			audio.pause();
			audio.removeEventListener("ended", onEnded);
			return;
		}

		audio.addEventListener("ended", onEnded);
		if (audio.paused && audio.currentTime > 0 && !audio.ended) {
			void audio.play().catch(() => {});
		} else {
			playTick();
		}

		return () => {
			audio.removeEventListener("ended", onEnded);
			stopPlayback();
		};
	}, [isActive, userPaused]);

	return (
		// Decorative presentation SFX — no speech to caption
		// biome-ignore lint/a11y/useMediaCaption: ambient tick sound, not dialogue
		<audio ref={audioRef} src={TICKING_CLOCK_SRC} preload="auto" aria-hidden />
	);
}
