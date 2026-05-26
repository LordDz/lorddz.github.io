import type { CSSProperties } from "react";

import type { SplashBurstParticle } from "./npf-splash-burst";

type Props = {
	particles: SplashBurstParticle[];
	paused?: boolean;
	/** Slow −25° → +25° tilt while flying (track 2). */
	wobbleRotate?: boolean;
};

export default function NpfSplashBurstLayer({
	particles,
	paused = false,
	wobbleRotate = false,
}: Props) {
	return (
		<>
			{particles.map((particle) => (
				<span
					key={particle.id}
					className={`npf-splash-burst${paused ? " is-paused" : ""}`}
					aria-hidden
					style={
						{
							"--npf-star-end-x": particle.endX,
							"--npf-star-end-y": particle.endY,
							"--npf-star-size": `${particle.size}rem`,
							"--npf-star-delay": `${particle.delay}s`,
							"--npf-star-duration": `${particle.duration}s`,
						} as CSSProperties
					}
				>
					{wobbleRotate ? (
						<span className="npf-splash-burst-rotate">{particle.emoji}</span>
					) : (
						particle.emoji
					)}
				</span>
			))}
		</>
	);
}
