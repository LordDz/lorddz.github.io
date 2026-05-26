const base = import.meta.env.BASE_URL;

export const NPF_SPLASH_PLAYLIST = [
	`${base}npf/splash-music.mp3`,
	`${base}npf/splash-music-kids.mp3`,
	`${base}npf/splash-music-happy-loop.mp3`,
	`${base}npf/splash-music-ukulele.mp3`,
] as const;

/** Default overlap before the current track ends (crossfade). */
export const NPF_SPLASH_CROSSFADE_MS = 1000;

/** Låt 1 → låt 2: start next track 3s before track 1 finishes. */
export const NPF_SPLASH_CROSSFADE_TRACK1_TO_2_MS = 3000;

export function getSplashCrossfadeMs(fromTrackIndex: number): number {
	return fromTrackIndex === 0
		? NPF_SPLASH_CROSSFADE_TRACK1_TO_2_MS
		: NPF_SPLASH_CROSSFADE_MS;
}

export const NPF_SPLASH_TRACK_HAPPY_BURST_INDEX = 1;
export const NPF_SPLASH_FEATURE_CREEP_TRACK_INDEX = 2;
export const NPF_SPLASH_TRACK_CROWD_INDEX = 3;
