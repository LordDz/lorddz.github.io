import type { Region } from "#/data/sc2CampaignArcade";

type Props = { region: Region; onChange: (region: Region) => void };

export default function RegionPicker({ region, onChange }: Props) {
	return (
		<div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2">
			<p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
				Region
			</p>
			<div className="flex gap-1">
				{(["eu", "us"] as const).map((option) => (
					<button
						key={option}
						type="button"
						aria-pressed={region === option}
						onClick={() => onChange(option)}
						className={`rounded-xl px-4 py-2 text-sm font-semibold ${region === option ? "bg-[var(--lagoon-deep)] text-white" : "text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)]"}`}
					>
						{option === "eu" ? "🇪🇺 EU" : "🇺🇸 US"}
					</button>
				))}
			</div>
		</div>
	);
}
