import type { Mission, Region } from "#/data/sc2CampaignArcade";

type Props = { mission: Mission; region: Region };
export default function MissionCard({ mission, region }: Props) {
	const realm = region === "eu" ? "2" : "1";
	return (
		<a
			href={`battlenet://starcraft/map/${realm}/${mission[region]}`}
			className="feature-card group rounded-2xl border border-[var(--line)] p-4 no-underline"
		>
			<span className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(79,184,178,0.16)] text-sm font-bold text-[var(--lagoon-deep)]">
				{mission.number}
			</span>
			<span className="block text-base font-semibold text-[var(--sea-ink)]">
				{mission.name}
			</span>
			<span className="mt-2 block text-xs text-[var(--sea-ink-soft)]">
				Open in StarCraft II Arcade <span aria-hidden="true">↗</span>
			</span>
		</a>
	);
}
