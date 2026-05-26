import { type CSSProperties, useMemo } from "react";

const STAR_COUNT = 40;
const STAR_SIZE_SCALE = 1.75;

function buildStars() {
	return Array.from({ length: STAR_COUNT }, (_, i) => {
		const angle = (360 / STAR_COUNT) * i + (i % 3) * 7;
		// Viewport-based distance so stars reach screen edges in all directions
		const distanceOffset = (i % 6) * 3;
		const distance = `calc(min(48vmin, 42vmax) + ${distanceOffset}vmin)`;
		const size = (0.85 + (i % 4) * 0.35) * STAR_SIZE_SCALE;
		const delay = (i * 0.07) % 2.2;
		const duration = 1.8 + (i % 3) * 0.4;
		return { id: i, angle, distance, size, delay, duration };
	});
}

export default function NpfSplashSlide() {
	const stars = useMemo(() => buildStars(), []);

	return (
		<div className="npf-splash-bg relative flex h-full min-h-dvh w-full items-center justify-center overflow-hidden">
			<div className="npf-splash-glow" aria-hidden />
			{stars.map((star) => (
				<span
					key={star.id}
					className="npf-star"
					aria-hidden
					style={
						{
							"--npf-star-angle": `${star.angle}deg`,
							"--npf-star-distance": `${star.distance}px`,
							"--npf-star-size": `${star.size}rem`,
							"--npf-star-delay": `${star.delay}s`,
							"--npf-star-duration": `${star.duration}s`,
						} as CSSProperties
					}
				>
					★
				</span>
			))}
			<div className="npf-title-wrap relative z-10 text-center">
				<p className="npf-title m-0 select-none">NPF</p>
				<p className="mt-6 text-sm font-semibold tracking-wide text-white/90 drop-shadow-md sm:text-base">
					Höger pil för att börja →
				</p>
			</div>
		</div>
	);
}
