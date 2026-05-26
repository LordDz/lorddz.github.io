import {
	type CSSProperties,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

import NpfFeatureCreepBanner from "./NpfFeatureCreepBanner";
import NpfSplashBurstLayer from "./NpfSplashBurstLayer";
import NpfSplashConcertCrowd from "./NpfSplashConcertCrowd";
import NpfSplashMusicAudio from "./NpfSplashMusicAudio";
import { buildTrack2Burst, buildTrack3Burst } from "./npf-splash-burst";
import {
	NPF_SPLASH_FEATURE_CREEP_TRACK_INDEX,
	NPF_SPLASH_TRACK_CROWD_INDEX,
	NPF_SPLASH_TRACK_HAPPY_BURST_INDEX,
} from "./npf-splash-playlist";

const STAR_COUNT = 40;
const STAR_SIZE_SCALE = 1.75;
/** Base timing ×20, then +15% speed → ÷1.15 */
const STAR_SPEED_MULTIPLIER = 20 / 1.15;
/** Tighter burst so stars stay close to the NPF title */
const STAR_DISTANCE_BASE_VMIN = 22;
const STAR_DISTANCE_SPREAD_VMIN = 2.5;

function buildStars() {
	return Array.from({ length: STAR_COUNT }, (_, i) => {
		const angleDeg = (360 / STAR_COUNT) * i + (i % 3) * 7;
		const distanceVmin =
			STAR_DISTANCE_BASE_VMIN + (i % 6) * STAR_DISTANCE_SPREAD_VMIN;
		const rad = (angleDeg * Math.PI) / 180;
		const endX = Math.sin(rad) * distanceVmin;
		const endY = -Math.cos(rad) * distanceVmin;
		const size = (0.85 + (i % 4) * 0.35) * STAR_SIZE_SCALE;
		const delay = ((i * 0.07) % 2.2) * STAR_SPEED_MULTIPLIER;
		const duration = (1.8 + (i % 3) * 0.4) * STAR_SPEED_MULTIPLIER;
		return {
			id: i,
			endX: `${endX}vmin`,
			endY: `${endY}vmin`,
			size,
			delay,
			duration,
		};
	});
}

type Props = {
	isActive: boolean;
	audioPaused: boolean;
};

export default function NpfSplashSlide({ isActive, audioPaused }: Props) {
	const stars = useMemo(() => buildStars(), []);
	const track2Burst = useMemo(() => buildTrack2Burst(), []);
	const track3Burst = useMemo(() => buildTrack3Burst(), []);
	const [maxTrackReached, setMaxTrackReached] = useState(-1);
	const [featureCreepPlayId, setFeatureCreepPlayId] = useState(0);

	useEffect(() => {
		if (!isActive) {
			setMaxTrackReached(-1);
			setFeatureCreepPlayId(0);
		}
	}, [isActive]);

	const onTrackStart = useCallback((trackIndex: number) => {
		setMaxTrackReached((max) => Math.max(max, trackIndex));
		if (trackIndex === NPF_SPLASH_FEATURE_CREEP_TRACK_INDEX) {
			setFeatureCreepPlayId((id) => id + 1);
		}
	}, []);

	const showHappyBurst = maxTrackReached >= NPF_SPLASH_TRACK_HAPPY_BURST_INDEX;
	const showChaosBurst =
		maxTrackReached >= NPF_SPLASH_FEATURE_CREEP_TRACK_INDEX;
	const showCrowd = maxTrackReached >= NPF_SPLASH_TRACK_CROWD_INDEX;

	return (
		<div className="npf-splash-bg relative flex h-full min-h-dvh w-full items-center justify-center overflow-hidden">
			<NpfSplashMusicAudio
				isActive={isActive}
				userPaused={audioPaused}
				onTrackStart={onTrackStart}
			/>
			{featureCreepPlayId > 0 ? (
				<NpfFeatureCreepBanner key={featureCreepPlayId} paused={audioPaused} />
			) : null}
			<div className="npf-splash-glow" aria-hidden />
			{stars.map((star) => (
				<span
					key={star.id}
					className={`npf-star${audioPaused ? " is-paused" : ""}`}
					aria-hidden
					style={
						{
							"--npf-star-end-x": star.endX,
							"--npf-star-end-y": star.endY,
							"--npf-star-size": `${star.size}rem`,
							"--npf-star-delay": `${star.delay}s`,
							"--npf-star-duration": `${star.duration}s`,
						} as CSSProperties
					}
				>
					★
				</span>
			))}
			{showHappyBurst ? (
				<NpfSplashBurstLayer
					particles={track2Burst}
					paused={audioPaused}
					wobbleRotate
				/>
			) : null}
			{showChaosBurst ? (
				<NpfSplashBurstLayer particles={track3Burst} paused={audioPaused} />
			) : null}
			{showCrowd ? <NpfSplashConcertCrowd paused={audioPaused} /> : null}
			<div className="npf-title-wrap relative z-10 text-center">
				{audioPaused ? (
					<div className="npf-splash-paused-hint" aria-hidden>
						<span className="npf-splash-paused-emoji" aria-hidden>
							😢
						</span>
						<span className="npf-splash-paused-mute" aria-hidden>
							🔇
						</span>
					</div>
				) : null}
				<p className="npf-title m-0 select-none">NPF</p>
				<p className="mt-6 text-sm font-semibold tracking-wide text-white/90 drop-shadow-md sm:text-base">
					Höger pil för att börja →
				</p>
			</div>
		</div>
	);
}
