import { describe, expect, it } from "vitest";

import {
	applyEntityRenames,
	DEFAULT_ENTITY_RENAMES,
} from "#/lib/entityRename/applyEntityRenames";

describe("applyEntityRenames", () => {
	it("renames known entities on Entity definition lines", () => {
		const input = [
			'Entity "imp_building7"',
			'{Entity "imp_building7" 0x2385',
			'Entity "imp_bunker07_new"',
			'Entity "imp_depot_octogon"',
		].join("\n");

		const result = applyEntityRenames(input);

		expect(result.content).toContain('Entity "imp_building_desert6"');
		expect(result.content).toContain('{Entity "imp_building_desert6" 0x2385');
		expect(result.content).toContain('Entity "imp_depot_octogon"');
		expect(result.content).toContain('Entity "imp_bunker_helipad"');
		expect(result.renamedCount).toBe(4);
		const impBuildingChange = result.changedEntities.find(
			(change) => change.from === "imp_building7",
		);
		expect(impBuildingChange?.lineNumbers).toEqual([1, 2]);
	});

	it("does not rename non-Entity lines even if quoted token matches", () => {
		const input = [
			'Trigger "imp_building7"',
			'Tags "imp_bunker07_new"',
			'Entity "gothic_ruin"',
		].join("\n");

		const result = applyEntityRenames(input);

		expect(result.content).toContain('Trigger "imp_building7"');
		expect(result.content).toContain('Tags "imp_bunker07_new"');
		expect(result.content).toContain('Entity "gothic_ruin1"');
		expect(result.renamedCount).toBe(1);
	});

	it("preserves CRLF line endings", () => {
		const input = 'Entity "radio_bunker"\r\nEntity "unknown_entity"\r\n';

		const result = applyEntityRenames(input);

		expect(result.content).toBe('Entity "imp_garage_small"\r\nEntity "unknown_entity"\r\n');
		expect(result.renamedCount).toBe(1);
	});

	it("keeps full mapping list available", () => {
		expect(DEFAULT_ENTITY_RENAMES.imp_building_001).toBe("imp_building_factory");
		expect(DEFAULT_ENTITY_RENAMES.imperialrelaytower).toBe("imp_relay_tower");
		expect(DEFAULT_ENTITY_RENAMES.imp_bunker01).toBe("imp_bunker1");
		expect(DEFAULT_ENTITY_RENAMES.chaos_cultism).toBe("sacrifice1");
		expect(Object.keys(DEFAULT_ENTITY_RENAMES).length).toBeGreaterThanOrEqual(38);
	});

	it("uses a custom rename map when provided", () => {
		const result = applyEntityRenames('Entity "custom_old"', {
			custom_old: "custom_new",
		});

		expect(result.content).toBe('Entity "custom_new"');
		expect(result.renamedCount).toBe(1);
	});

	it("renames newly added bunker and statue entities", () => {
		const input = [
			'Entity "imp_statue01"',
			'Entity "radio_bunker2"',
			'Entity "chaos_cultism"',
		].join("\n");

		const result = applyEntityRenames(input);

		expect(result.content).toContain('Entity "imp_statue1"');
		expect(result.content).toContain('Entity "imp_bunker_radio"');
		expect(result.content).toContain('Entity "sacrifice1"');
		expect(result.renamedCount).toBe(3);
	});
});
