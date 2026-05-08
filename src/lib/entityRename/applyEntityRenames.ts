export const ENTITY_RENAMES: Record<string, string> = {
	flagsoyka_1: "capture_ring",
	gothic_ruin: "gothic_ruin1",
	gothic_ruin002: "gothic_ruin2",
	imp_building_001: "imp_building_factory",
	imp_building2: "imp_building_desert1",
	imp_building3: "imp_building_desert2",
	imp_building4: "imp_building_desert3",
	imp_building5: "imp_building_desert4",
	imp_building6: "imp_building_desert5",
	imp_building7: "imp_building_desert6",
	imp_building8: "imp_building_desert7",
	imp_bunker07_new: "imp_depot_octogon",
	imp_depot_octogon: "imp_bunker_helipad",
	imperialrelaytower: "imp_relay_tower",
	radio_bunker: "imp_garage_small",
};

type EntityChange = {
	from: string;
	to: string;
	count: number;
};

export function applyEntityRenames(text: string) {
	const lineEnding = text.includes("\r\n") ? "\r\n" : "\n";
	let renamedCount = 0;
	const countsByPair = new Map<string, EntityChange>();

	const nextLines = text.split(/\r?\n/).map((line) => {
		const match = /^(\s*Entity\s+")([^"]+)(".*)$/.exec(line);
		if (!match) return line;

		const [, prefix, entityName, suffix] = match;
		const replacement = ENTITY_RENAMES[entityName];
		if (!replacement) return line;

		renamedCount += 1;
		const pairKey = `${entityName}=>${replacement}`;
		const existing = countsByPair.get(pairKey);
		if (existing) {
			existing.count += 1;
		} else {
			countsByPair.set(pairKey, {
				from: entityName,
				to: replacement,
				count: 1,
			});
		}
		return `${prefix}${replacement}${suffix}`;
	});

	return {
		content: nextLines.join(lineEnding),
		renamedCount,
		changedEntities: Array.from(countsByPair.values()),
	};
}
