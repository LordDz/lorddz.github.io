import { describe, expect, it } from "vitest";
import { applyIdRemap, buildMergeResult } from "#/lib/miMerge/mergeMi";
import {
	extractHelpersLayout,
	extractMissionEntityBlocks,
} from "#/lib/miMerge/parseMi";

describe("applyIdRemap", () => {
	it("replaces longer hex ids before shorter prefixes", () => {
		const m = new Map([
			["0x802", "0x1"],
			["0x802f", "0x2"],
		]);
		expect(applyIdRemap("id 0x802f and 0x802 end", m)).toBe(
			"id 0x2 and 0x1 end",
		);
	});
});

describe("buildMergeResult", () => {
	const reference = `{mission
\t{Entity "a" 0x10
\t\t{MID 16}
\t}
\t{Tags "t" 0x10}
\t{Helpers
\t\t{vars
\t\t\t{"from_ref"}
\t\t}
\t\t{triggers
\t\t\t{"tr" {x 0x10}}
\t\t}
\t}
}
`;

	const target = `{mission
\t{Entity "b" 0x10
\t\t{MID 16}
\t}
\t{Helpers
\t\t{vars
\t\t\t{"old_var"}
\t\t}
\t\t{triggers
\t\t\t{"old_trig"}
\t\t}
\t}
}
`;

	it("extracts helpers layout from fixture", () => {
		const r = extractHelpersLayout(reference);
		expect(r).not.toBeNull();
		if (!r) throw new Error("expected layout");
		const vars = reference.slice(r.varsOpenInFile, r.varsCloseInFile + 1);
		expect(vars).toContain("from_ref");
		const ents = extractMissionEntityBlocks(reference);
		expect(ents).toHaveLength(1);
		expect(ents[0]?.id).toBe("0x10");
	});

	it("remaps colliding entity id and replaces vars/triggers", () => {
		const out = buildMergeResult(reference, target);
		expect(out.ok).toBe(true);
		if (!out.ok) return;
		expect(out.preview.vars).toContain("from_ref");
		expect(out.preview.triggers).toContain("0xf00000");
		expect(out.preview.entities).toContain("0xf00000");
		expect(out.outputText).toContain('\t{Entity "b" 0x10');
		expect(out.outputText).toContain('\t{Entity "a" 0xf00000');
		expect(out.outputText).not.toContain('\t{Entity "a" 0x10\n');
		expect(out.outputText).toContain("from_ref");
	});
});
