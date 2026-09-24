import type { Campaign } from "#/data/sc2CampaignArcade";

type Props = {
	campaigns: Campaign[];
	activeCampaignId: string;
	onSelect: (campaignId: string) => void;
};
export default function CampaignTabs({
	campaigns,
	activeCampaignId,
	onSelect,
}: Props) {
	return (
		<div className="flex flex-wrap gap-2">
			{campaigns.map((campaign) => (
				<button
					key={campaign.id}
					type="button"
					onClick={() => onSelect(campaign.id)}
					className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${activeCampaignId === campaign.id ? "border-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.2)] text-[var(--sea-ink)]" : "border-[var(--line)] bg-[var(--surface)] text-[var(--sea-ink-soft)] hover:bg-[var(--surface-strong)]"}`}
				>
					{campaign.title}
				</button>
			))}
		</div>
	);
}
