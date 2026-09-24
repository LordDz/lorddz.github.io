import type { Mission, Region } from "#/data/sc2CampaignArcade";
import MissionCard from "./MissionCard";

type Props = { missions: Mission[]; region: Region };
export default function MissionGrid({ missions, region }: Props) {
	return (
		<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{missions.map((mission) => (
				<MissionCard key={mission.number} mission={mission} region={region} />
			))}
		</div>
	);
}
