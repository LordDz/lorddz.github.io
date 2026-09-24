import { describe, expect, it } from "vitest";
import {
	createFreshLayout,
	generateStartupActions,
	parseStartupActions,
	profilesFromSettings,
} from "./windowsTerminalLayout";

const profiles = profilesFromSettings({
	profiles: {
		list: [
			{ guid: "{pwsh}", name: "PowerShell" },
			{ guid: "{ubuntu}", name: "Ubuntu" },
		],
	},
});
describe("Windows Terminal layout", () => {
	it("reads profiles", () =>
		expect(profiles.map((profile) => profile.name)).toEqual([
			"PowerShell",
			"Ubuntu",
		]));
	it("parses tabs, panes, directories and colors", () => {
		const layout = parseStartupActions(
			'new-tab -p "PowerShell" -d "C:\\Code" --tabColor "#4fb8b2" ; split-pane -H -p "Ubuntu" --size .4 ; new-tab -p "Ubuntu"',
			profiles,
		);
		expect(layout.tabs).toHaveLength(2);
		expect(layout.tabs[0].root.type).toBe("split");
		expect(
			layout.tabs[0].root.type === "split" &&
				layout.tabs[0].root.second.type === "pane" &&
				layout.tabs[0].root.second.profileGuid,
		).toBe("{ubuntu}");
	});
	it("rejects commands it cannot preserve", () =>
		expect(() =>
			parseStartupActions("new-tab -p PowerShell ; move-focus left", profiles),
		).toThrow("Unsupported focus command"));
	it("generates a fresh layout", () =>
		expect(generateStartupActions(createFreshLayout(profiles), profiles)).toBe(
			'new-tab -p "PowerShell"',
		));
});
