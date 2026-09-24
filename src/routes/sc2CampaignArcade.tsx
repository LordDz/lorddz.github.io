import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import CampaignEmptyState from "#/components/sc2CampaignArcade/CampaignEmptyState";
import CampaignTabs from "#/components/sc2CampaignArcade/CampaignTabs";
import MissionGrid from "#/components/sc2CampaignArcade/MissionGrid";
import RegionPicker from "#/components/sc2CampaignArcade/RegionPicker";
import {
	campaigns,
	type Region,
	wingsOfLiberty,
} from "#/data/sc2CampaignArcade";

export const Route = createFileRoute("/sc2CampaignArcade")({
	component: Sc2CampaignArcade,
});

function Sc2CampaignArcade() {
	const [region, setRegion] = useState<Region>("eu");
	const [activeCampaignId, setActiveCampaignId] = useState("wol");
	useEffect(() => {
		const saved = window.localStorage.getItem("sc2-campaign-region");
		if (saved === "eu" || saved === "us") setRegion(saved);
	}, []);
	const changeRegion = (next: Region) => {
		setRegion(next);
		window.localStorage.setItem("sc2-campaign-region", next);
	};
	const campaign =
		campaigns.find((item) => item.id === activeCampaignId) ?? campaigns[0];
	return (
		<main className="page-wrap px-4 pb-12 pt-6">
			<section className="island-shell rise-in rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
				<div className="flex flex-wrap items-start justify-between gap-5">
					<div>
						<p className="island-kicker mb-3">StarCraft II Arcade</p>
						<h1 className="display-title mb-4 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
							Campaign Arcade
						</h1>
						<p className="mb-0 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
							Launch campaign missions directly in StarCraft II Arcade. Pick
							your Battle.net region, then choose a mission card.
						</p>
					</div>
					<RegionPicker region={region} onChange={changeRegion} />
				</div>
			</section>
			<section className="mt-8">
				<CampaignTabs
					campaigns={campaigns}
					activeCampaignId={activeCampaignId}
					onSelect={setActiveCampaignId}
				/>
				<div className="mt-6">
					<h2 className="mb-1 text-2xl font-semibold text-[var(--sea-ink)]">
						{campaign.title}
					</h2>
					<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
						{campaign.subtitle} · opening links for {region.toUpperCase()}
					</p>
				</div>
				{campaign.available ? (
					<MissionGrid missions={wingsOfLiberty} region={region} />
				) : (
					<CampaignEmptyState campaign={campaign} />
				)}
			</section>
			<p className="mt-8 text-xs text-[var(--sea-ink-soft)]">
				These are local <code>battlenet://</code> links. StarCraft II must be
				installed for a mission to launch.
			</p>
		</main>
	);
}
