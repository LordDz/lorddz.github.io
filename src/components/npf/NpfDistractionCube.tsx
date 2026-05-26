/** Subtle peripheral distraction for the "positivt" slide — easy to miss, hard to ignore. */
export default function NpfDistractionCube() {
	return (
		<div className="npf-distraction-cube-track" aria-hidden>
			<div className="npf-distraction-cube-bob">
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
