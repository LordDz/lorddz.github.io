import { useEffect, useRef } from "react";

import { NPF_PRESENTATION_VOLUME } from "./npf-audio";
import {
	getSplashCrossfadeMs,
	NPF_SPLASH_PLAYLIST,
} from "./npf-splash-playlist";

type Props = {
	isActive: boolean;
	userPaused: boolean;
	onTrackStart?: (trackIndex: number) => void;
};

function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") {
		return false;
	}
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Splash playlist with crossfade overlap between tracks (3s before låt 2). */
export default function NpfSplashMusicAudio({
	isActive,
	userPaused,
	onTrackStart,
}: Props) {
	const audioRefA = useRef<HTMLAudioElement>(null);
	const audioRefB = useRef<HTMLAudioElement>(null);
	const activeSlotRef = useRef(0);
	const trackIndexRef = useRef(0);
	const scheduledCrossfadeRef = useRef(false);
	const crossfadeRafRef = useRef<number | null>(null);
	const isActiveRef = useRef(isActive);
	const userPausedRef = useRef(userPaused);
	const onTrackStartRef = useRef(onTrackStart);

	isActiveRef.current = isActive;
	userPausedRef.current = userPaused;
	onTrackStartRef.current = onTrackStart;

	useEffect(() => {
		const slotA = audioRefA.current;
		const slotB = audioRefB.current;
		if (!slotA || !slotB) {
			return;
		}

		const getActive = () => (activeSlotRef.current === 0 ? slotA : slotB);
		const getInactive = () => (activeSlotRef.current === 0 ? slotB : slotA);

		const cancelCrossfade = () => {
			if (crossfadeRafRef.current !== null) {
				cancelAnimationFrame(crossfadeRafRef.current);
				crossfadeRafRef.current = null;
			}
		};

		const stopAll = () => {
			cancelCrossfade();
			slotA.pause();
			slotB.pause();
			slotA.currentTime = 0;
			slotB.currentTime = 0;
			scheduledCrossfadeRef.current = false;
		};

		const playTrackImmediate = (index: number) => {
			cancelCrossfade();
			const active = getActive();
			trackIndexRef.current = index;
			active.src = NPF_SPLASH_PLAYLIST[index];
			active.volume = NPF_PRESENTATION_VOLUME;
			active.currentTime = 0;
			scheduledCrossfadeRef.current = false;
			onTrackStartRef.current?.(index);
			void active.play().catch(() => {});
		};

		const startCrossfadeTo = (nextIndex: number, crossfadeMs: number) => {
			cancelCrossfade();
			const outgoing = getActive();
			const incoming = getInactive();
			trackIndexRef.current = nextIndex;
			incoming.src = NPF_SPLASH_PLAYLIST[nextIndex];
			incoming.currentTime = 0;
			incoming.volume = 0;
			onTrackStartRef.current?.(nextIndex);
			void incoming.play().catch(() => {});

			const outgoingStartVol = outgoing.volume;
			const crossfadeStart = performance.now();

			const step = () => {
				if (userPausedRef.current || !isActiveRef.current) {
					cancelCrossfade();
					return;
				}
				const t = Math.min(
					1,
					(performance.now() - crossfadeStart) / crossfadeMs,
				);
				outgoing.volume = outgoingStartVol * (1 - t);
				incoming.volume = NPF_PRESENTATION_VOLUME * t;
				if (t < 1) {
					crossfadeRafRef.current = requestAnimationFrame(step);
					return;
				}
				crossfadeRafRef.current = null;
				outgoing.pause();
				outgoing.currentTime = 0;
				outgoing.volume = NPF_PRESENTATION_VOLUME;
				incoming.volume = NPF_PRESENTATION_VOLUME;
				activeSlotRef.current = 1 - activeSlotRef.current;
				scheduledCrossfadeRef.current = false;
			};

			crossfadeRafRef.current = requestAnimationFrame(step);
		};

		const scheduleCrossfadeIfNeeded = () => {
			if (scheduledCrossfadeRef.current) {
				return;
			}
			const active = getActive();
			const duration = active.duration;
			if (!Number.isFinite(duration) || duration <= 0) {
				return;
			}
			const remaining = duration - active.currentTime;
			const crossfadeMs = getSplashCrossfadeMs(trackIndexRef.current);
			if (remaining > crossfadeMs / 1000) {
				return;
			}
			if (remaining <= 0) {
				return;
			}
			scheduledCrossfadeRef.current = true;
			const nextIndex =
				(trackIndexRef.current + 1) % NPF_SPLASH_PLAYLIST.length;
			startCrossfadeTo(nextIndex, crossfadeMs);
		};

		const onTimeUpdate = () => {
			scheduleCrossfadeIfNeeded();
		};

		const onEnded = (event: Event) => {
			const target = event.currentTarget;
			if (!(target instanceof HTMLAudioElement)) {
				return;
			}
			if (target !== getActive()) {
				return;
			}
			if (scheduledCrossfadeRef.current) {
				return;
			}
			const nextIndex =
				(trackIndexRef.current + 1) % NPF_SPLASH_PLAYLIST.length;
			startCrossfadeTo(nextIndex, getSplashCrossfadeMs(trackIndexRef.current));
		};

		slotA.addEventListener("timeupdate", onTimeUpdate);
		slotB.addEventListener("timeupdate", onTimeUpdate);
		slotA.addEventListener("ended", onEnded);
		slotB.addEventListener("ended", onEnded);

		if (!isActive || prefersReducedMotion()) {
			stopAll();
			trackIndexRef.current = 0;
			activeSlotRef.current = 0;
			slotA.removeEventListener("timeupdate", onTimeUpdate);
			slotB.removeEventListener("timeupdate", onTimeUpdate);
			slotA.removeEventListener("ended", onEnded);
			slotB.removeEventListener("ended", onEnded);
			return;
		}

		if (userPaused) {
			cancelCrossfade();
			slotA.pause();
			slotB.pause();
			slotA.removeEventListener("timeupdate", onTimeUpdate);
			slotB.removeEventListener("timeupdate", onTimeUpdate);
			slotA.removeEventListener("ended", onEnded);
			slotB.removeEventListener("ended", onEnded);
			return;
		}

		const active = getActive();
		if (!active.src) {
			playTrackImmediate(0);
		} else if (active.paused) {
			void active.play().catch(() => {});
			const inactive = getInactive();
			if (!inactive.paused) {
				void inactive.play().catch(() => {});
			}
		}

		return () => {
			cancelCrossfade();
			slotA.removeEventListener("timeupdate", onTimeUpdate);
			slotB.removeEventListener("timeupdate", onTimeUpdate);
			slotA.removeEventListener("ended", onEnded);
			slotB.removeEventListener("ended", onEnded);
		};
	}, [isActive, userPaused]);

	return (
		<>
			{/* biome-ignore lint/a11y/useMediaCaption: ambient presentation music */}
			<audio ref={audioRefA} preload="auto" aria-hidden />
			{/* biome-ignore lint/a11y/useMediaCaption: ambient presentation music */}
			<audio ref={audioRefB} preload="auto" aria-hidden />
		</>
	);
}
