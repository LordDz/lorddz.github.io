type Props = {
	paused?: boolean;
};

export default function NpfFeatureCreepBanner({ paused = false }: Props) {
	return (
		<div
			className={`npf-feature-creep${paused ? " is-paused" : ""}`}
			aria-live="polite"
		>
			<p className="npf-feature-creep-title">Varför spelas den här musiken?</p>
			<p className="npf-feature-creep-answer">Svar: FEATURE CREEP</p>
		</div>
	);
}
