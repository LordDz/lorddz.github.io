import type { NpfContentSlide as NpfContentSlideData } from "#/data/npf-slides";
import NpfDistractionCube from "./NpfDistractionCube";
import NpfTickingClockAudio from "./NpfTickingClockAudio";

type Props = {
	slide: NpfContentSlideData;
	isActive: boolean;
	audioPaused: boolean;
	showNotesHint?: boolean;
};

export default function NpfContentSlide({
	slide,
	isActive,
	audioPaused,
	showNotesHint,
}: Props) {
	const showDistractionCube = slide.id === "positivt";
	const showTickingClock = slide.id === "negativt";

	return (
		<div className="npf-content-bg relative flex h-full min-h-dvh w-full items-center justify-center overflow-hidden px-6 py-16 sm:px-12">
			{showDistractionCube ? <NpfDistractionCube /> : null}
			{showTickingClock ? (
				<NpfTickingClockAudio isActive={isActive} userPaused={audioPaused} />
			) : null}
			<div className="relative z-10 w-full max-w-3xl">
				{slide.kicker ? (
					<p className="island-kicker mb-3 text-[var(--kicker)]">
						{slide.kicker}
					</p>
				) : null}
				<h1 className="display-title mb-8 text-3xl font-bold leading-tight text-[var(--sea-ink)] sm:text-5xl">
					{slide.title}
				</h1>
				<ul className="m-0 list-none space-y-4 p-0">
					{slide.bullets.map((bullet) => (
						<li
							key={bullet}
							className="flex gap-3 text-lg leading-relaxed text-[var(--sea-ink-soft)] sm:text-xl"
						>
							<span
								className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--lagoon)]"
								aria-hidden
							/>
							<span>{bullet}</span>
						</li>
					))}
				</ul>
				{showNotesHint ? (
					<p className="mt-10 text-sm text-[var(--sea-ink-soft)] opacity-70">
						Tryck{" "}
						<kbd className="rounded border border-[var(--line)] px-1.5 py-0.5 font-mono text-xs">
							B
						</kbd>{" "}
						för att växla talaranteckningar
					</p>
				) : null}
			</div>
		</div>
	);
}
