import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type SpawnSide = "left" | "right" | "top" | "bottom";

type CubePath = {
	side: SpawnSide;
	lane: number;
};

const PATH_DURATION_S = 22;

function randomLane(): number {
	return 20 + Math.random() * 60;
}

function pickRandomPath(): CubePath {
	const sides: SpawnSide[] = ["left", "right", "top", "bottom"];
	const side = sides[Math.floor(Math.random() * sides.length)] ?? "left";
	return { side, lane: randomLane() };
}

function pathStyle(path: CubePath): CSSProperties {
	const lane = `${path.lane}%`;

	switch (path.side) {
		case "left":
			return {
				"--cube-start-left": "-4rem",
				"--cube-start-top": lane,
				"--cube-end-left": "calc(100% + 1rem)",
				"--cube-end-top": lane,
			} as CSSProperties;
		case "right":
			return {
				"--cube-start-left": "calc(100% + 1rem)",
				"--cube-start-top": lane,
				"--cube-end-left": "-4rem",
				"--cube-end-top": lane,
			} as CSSProperties;
		case "top":
			return {
				"--cube-start-left": lane,
				"--cube-start-top": "-4rem",
				"--cube-end-left": lane,
				"--cube-end-top": "calc(100% + 1rem)",
			} as CSSProperties;
		case "bottom":
			return {
				"--cube-start-left": lane,
				"--cube-start-top": "calc(100% + 1rem)",
				"--cube-end-left": lane,
				"--cube-end-top": "-4rem",
			} as CSSProperties;
	}
}

type Props = {
	isActive: boolean;
};

/** Subtle peripheral distraction for the "negativt" slide — easy to miss, hard to ignore. */
export default function NpfDistractionCube({ isActive }: Props) {
	const [path, setPath] = useState<CubePath>(pickRandomPath);
	const wasActiveRef = useRef(false);

	useEffect(() => {
		if (isActive && !wasActiveRef.current) {
			setPath(pickRandomPath());
		}
		wasActiveRef.current = isActive;
	}, [isActive]);

	if (!isActive) {
		return null;
	}

	return (
		<div className="npf-distraction-cube-track" aria-hidden>
			<div
				key={`${path.side}-${path.lane}`}
				className="npf-distraction-cube-bob"
				style={{
					...pathStyle(path),
					"--cube-path-duration": `${PATH_DURATION_S}s`,
				}}
			>
				<div className="npf-distraction-cube-scene">
					<div className="npf-distraction-cube">
						<div className="npf-distraction-cube-face npf-distraction-cube-face--front" />
						<div className="npf-distraction-cube-face npf-distraction-cube-face--back" />
						<div className="npf-distraction-cube-face npf-distraction-cube-face--right" />
						<div className="npf-distraction-cube-face npf-distraction-cube-face--left" />
						<div className="npf-distraction-cube-face npf-distraction-cube-face--top" />
						<div className="npf-distraction-cube-face npf-distraction-cube-face--bottom" />
					</div>
				</div>
			</div>
		</div>
	);
}
