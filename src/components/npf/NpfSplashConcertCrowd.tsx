import type { CSSProperties } from "react";

/** Unique concert / wave emojis — no repeats in the row. */
const CROWD_FIGURES = [
	{ id: "crowd-0", emoji: "🌞" },
	{ id: "crowd-1", emoji: "🙋‍♀️" },
	{ id: "crowd-2", emoji: "🙋‍♂️" },
	{ id: "crowd-3", emoji: "👋" },
	{ id: "crowd-4", emoji: "🙌" },
	{ id: "crowd-5", emoji: "👏" },
	{ id: "crowd-6", emoji: "🤚" },
	{ id: "crowd-7", emoji: "✋" },
	{ id: "crowd-8", emoji: "🖐️" },
	{ id: "crowd-9", emoji: "🤘" },
	{ id: "crowd-10", emoji: "💃" },
	{ id: "crowd-11", emoji: "🕺" },
	{ id: "crowd-12", emoji: "🥳" },
	{ id: "crowd-13", emoji: "🎉" },
] as const;

type Props = {
	paused?: boolean;
};

export default function NpfSplashConcertCrowd({ paused = false }: Props) {
	return (
		<div
			className={`npf-splash-crowd${paused ? " is-paused" : ""}`}
			aria-hidden
		>
			{CROWD_FIGURES.map((figure, index) => (
				<span
					key={figure.id}
					className="npf-splash-crowd-figure"
					style={
						{
							"--npf-crowd-delay": `${index * 0.1}s`,
						} as CSSProperties
					}
				>
					{figure.emoji}
				</span>
			))}
		</div>
	);
}
