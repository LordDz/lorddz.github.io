import { describe, expect, it } from "vitest";

import { applyEntityRenames, ENTITY_RENAMES } from "#/lib/entityRename/applyEntityRenames";

describe("applyEntityRenames", () => {
	it("renames known entities on Entity definition lines", () => {
		const input = [
			'Entity "imp_building7"',
			'Entity "imp_bunker07_new"',
			'Entity "imp_depot_octogon"',
		].join("\n");

		const result = applyEntityRenames(input);

		expect(result.content).toContain('Entity "imp_building_desert6"');
		expect(result.content).toContain('Entity "imp_depot_octogon"');
		expect(result.content).toContain('Entity "imp_bunker_helipad"');
		expect(result.renamedCount).toBe(3);
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
		expect(ENTITY_RENAMES.imp_building_001).toBe("imp_building_factory");
		expect(ENTITY_RENAMES.imperialrelaytower).toBe("imp_relay_tower");
		expect(Object.keys(ENTITY_RENAMES).length).toBeGreaterThanOrEqual(15);
	});
});
