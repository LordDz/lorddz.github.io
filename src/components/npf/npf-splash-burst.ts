/** Star timing (matches NpfSplashSlide). */
export const SPLASH_STAR_SPEED_MULTIPLIER = 20 / 1.15;

/** 40% faster than stars. */
export const SPLASH_BURST_SPEED_MULTIPLIER = SPLASH_STAR_SPEED_MULTIPLIER / 1.4;

const DISTANCE_BASE_VMIN = 22;
const DISTANCE_SPREAD_VMIN = 2.5;

export type SplashBurstParticle = {
	id: string;
	emoji: string;
	endX: string;
	endY: string;
	size: number;
	delay: number;
	duration: number;
};

type BuildRadialBurstOptions = {
	count: number;
	emojis: readonly string[];
	speedMultiplier: number;
	distanceScale?: number;
	idPrefix: string;
	sizeScale?: number;
};

export function buildRadialBurst(
	options: BuildRadialBurstOptions,
): SplashBurstParticle[] {
	const {
		count,
		emojis,
		speedMultiplier,
		distanceScale = 1,
		idPrefix,
		sizeScale = 1.75,
	} = options;
	const base = DISTANCE_BASE_VMIN * distanceScale;
	const spread = DISTANCE_SPREAD_VMIN * distanceScale;

	return Array.from({ length: count }, (_, i) => {
		const angleDeg = (360 / count) * i + (i % 3) * 7;
		const distanceVmin = base + (i % 6) * spread;
		const rad = (angleDeg * Math.PI) / 180;
		const endX = Math.sin(rad) * distanceVmin;
		const endY = -Math.cos(rad) * distanceVmin;
		const emoji = emojis[(i * 7 + 13) % emojis.length] ?? "✨";
		const size = (0.85 + (i % 4) * 0.35) * sizeScale;
		const delay = ((i * 0.07) % 2.2) * speedMultiplier;
		const duration = (1.8 + (i % 3) * 0.4) * speedMultiplier;
		return {
			id: `${idPrefix}-${i}`,
			emoji,
			endX: `${endX}vmin`,
			endY: `${endY}vmin`,
			size,
			delay,
			duration,
		};
	});
}

const TRACK2_EMOJIS = ["🍍", "🌞", "🎉", "😄", "✨"] as const;

const TRACK3_EMOJIS = [
	"🌈",
	"✨",
	"🎉",
	"🍍",
	"😄",
	"🎵",
	"💖",
	"🌟",
	"🥳",
	"🎈",
	"☀️",
	"🍉",
] as const;

export function buildTrack2Burst(): SplashBurstParticle[] {
	return buildRadialBurst({
		count: 28,
		emojis: TRACK2_EMOJIS,
		speedMultiplier: SPLASH_BURST_SPEED_MULTIPLIER,
		idPrefix: "t2",
	});
}

export function buildTrack3Burst(): SplashBurstParticle[] {
	return buildRadialBurst({
		count: 42,
		emojis: TRACK3_EMOJIS,
		speedMultiplier: SPLASH_BURST_SPEED_MULTIPLIER,
		distanceScale: 1.05,
		idPrefix: "t3",
		sizeScale: 1.9,
	});
}
