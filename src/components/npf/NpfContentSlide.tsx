import type {
	NpfBullet,
	NpfContentSlide as NpfContentSlideData,
} from "#/data/npf-slides";
import NpfDistractionCube from "./NpfDistractionCube";
import NpfTickingClockAudio from "./NpfTickingClockAudio";

type Props = {
	slide: NpfContentSlideData;
	isActive: boolean;
	audioPaused: boolean;
	showNotesHint?: boolean;
};

function bulletText(bullet: NpfBullet): string {
	return typeof bullet === "string" ? bullet : bullet.text;
}

function bulletSubtext(bullet: NpfBullet): string | undefined {
	return typeof bullet === "string" ? undefined : bullet.subtext;
}

export default function NpfContentSlide({
	slide,
	isActive,
	audioPaused,
	showNotesHint,
}: Props) {
	const showDistractionCube = slide.id === "negativt";
	const showTickingClock = slide.id === "negativt";

	return (
		<div className="npf-content-bg relative flex h-full min-h-dvh w-full items-center justify-center overflow-hidden px-6 py-16 sm:px-12">
			{showDistractionCube ? <NpfDistractionCube isActive={isActive} /> : null}
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
					{slide.bullets.map((bullet) => {
						const subtext = bulletSubtext(bullet);
						const text = bulletText(bullet);
						return (
							<li
								key={`${slide.id}-${text}-${subtext ?? ""}`}
								className="flex gap-3 text-lg leading-relaxed text-[var(--sea-ink-soft)] sm:text-xl"
							>
								{slide.id === "myter" ? (
									<span
										className="mt-0.5 flex-shrink-0 text-lg font-bold leading-none text-red-500 sm:text-xl"
										aria-hidden
									>
										✕
									</span>
								) : (
									<span
										className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--lagoon)]"
										aria-hidden
									/>
								)}
								<span className="min-w-0">
									<span>{bulletText(bullet)}</span>
									{subtext ? (
										<span className="mt-1 block pl-0 text-base leading-relaxed opacity-80 sm:text-lg">
											{subtext}
										</span>
									) : null}
								</span>
							</li>
						);
					})}
				</ul>
				{slide.callout ? (
					<p className="npf-slide-callout">{slide.callout}</p>
				) : null}
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
