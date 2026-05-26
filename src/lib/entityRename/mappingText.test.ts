import { describe, expect, it } from "vitest";

import {
	formatEntityRenamesText,
	parseEntityRenamesText,
} from "#/lib/entityRename/mappingText";

describe("mappingText", () => {
	it("formats mappings as from -> to lines", () => {
		const text = formatEntityRenamesText({
			zebra: "z2",
			alpha: "a2",
		});
		expect(text).toBe("alpha -> a2\nzebra -> z2");
	});

	it("parses arrow and renamed-to lines", () => {
		const { mappings, errors } = parseEntityRenamesText(
			[
				"imp_bunker01 -> imp_bunker1",
				"radio_bunker2 renamed to imp_bunker_radio",
				"imp_bunker deleted (bugged model)",
				"# comment",
			].join("\n"),
		);

		expect(errors).toEqual([]);
		expect(mappings).toEqual({
			imp_bunker01: "imp_bunker1",
			radio_bunker2: "imp_bunker_radio",
		});
	});

	it("reports parse errors for invalid lines", () => {
		const { mappings, errors } = parseEntityRenamesText("not a mapping line");

		expect(Object.keys(mappings)).toHaveLength(0);
		expect(errors).toHaveLength(1);
		expect(errors[0]).toContain("Line 1");
	});
});
