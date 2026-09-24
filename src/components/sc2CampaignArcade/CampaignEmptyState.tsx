import type { Campaign } from "#/data/sc2CampaignArcade";

export default function CampaignEmptyState({
	campaign,
}: {
	campaign: Campaign;
}) {
	return (
		<div className="mt-5 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-8 text-center">
			<p className="m-0 text-base font-semibold text-[var(--sea-ink)]">
				{campaign.title} is being prepared.
			</p>
			<p className="mt-2 mb-0 text-sm text-[var(--sea-ink-soft)]">
				The region picker and campaign tab are ready; mission links will follow.
			</p>
		</div>
	);
}
