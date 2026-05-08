import { describe, expect, it } from "vitest";

import { isAcceptedEntityRenameFilename } from "#/lib/entityRename/fileAcceptance";

describe("isAcceptedEntityRenameFilename", () => {
	it("accepts map filename with no extension", () => {
		expect(isAcceptedEntityRenameFilename("map")).toBe(true);
		expect(isAcceptedEntityRenameFilename("MAP")).toBe(true);
	});

	it("accepts .mi files", () => {
		expect(isAcceptedEntityRenameFilename("mission.mi")).toBe(true);
		expect(isAcceptedEntityRenameFilename("MISSION.MI")).toBe(true);
	});

	it("rejects non-map and non-.mi files", () => {
		expect(isAcceptedEntityRenameFilename("map.txt")).toBe(false);
		expect(isAcceptedEntityRenameFilename("mission.xml")).toBe(false);
		expect(isAcceptedEntityRenameFilename("readme")).toBe(false);
	});
});
