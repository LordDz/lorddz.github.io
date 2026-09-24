import { describe, expect, it } from "vitest";
import {
	createFreshLayout,
	createPresetLayout,
	generateStartupActions,
	parseStartupActions,
	profilesFromSettings,
	swapPaneContents,
	updateSplitRatio,
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
			'new-tab -p "PowerShell" -d "C:\\Code" --title "Work" --tabColor "#4fb8b2" ; split-pane -H -p "Ubuntu" --size .4 ; new-tab -p "Ubuntu"',
			profiles,
		);
		expect(layout.tabs).toHaveLength(2);
		expect(layout.tabs[0].root.type).toBe("split");
		expect(
			layout.tabs[0].root.type === "split" &&
				layout.tabs[0].root.second.type === "pane" &&
				layout.tabs[0].root.second.profileGuid,
		).toBe("{ubuntu}");
		expect(
			layout.tabs[0].root.type === "split" &&
				layout.tabs[0].root.first.type === "pane" &&
				layout.tabs[0].root.first.title,
		).toBe("Work");
	});
	it("rejects commands it cannot preserve", () =>
		expect(() =>
			parseStartupActions("new-tab -p PowerShell ; move-focus left", profiles),
		).toThrow("Unsupported focus command"));
	it("generates a fresh layout", () =>
		expect(generateStartupActions(createFreshLayout(profiles), profiles)).toBe(
			'new-tab -p "PowerShell"',
		));
	it("round-trips V2 pane options", () => {
		const layout = parseStartupActions(
			'new-tab -p "PowerShell" --colorScheme "Campbell" --appendCommandLine nvim .',
			profiles,
		);
		const pane = layout.tabs[0].root;
		expect(pane.type === "pane" && pane.commandLine).toBe("nvim .");
		expect(pane.type === "pane" && pane.appendCommandLine).toBe(true);
		expect(generateStartupActions(layout, profiles)).toContain(
			'--colorScheme "Campbell" --appendCommandLine nvim .',
		);
	});
	it("creates editable presets and updates their split ratio", () => {
		const layout = createPresetLayout("grid", profiles);
		expect(layout.tabs[0].root.type).toBe("split");
		const root = layout.tabs[0].root;
		if (root.type !== "split") return;
		const resized = updateSplitRatio(root, root.id, 0.7);
		expect(resized.type === "split" && resized.ratio).toBe(0.7);
		const first = root.first.type === "split" ? root.first.first : null;
		const second = root.first.type === "split" ? root.first.second : null;
		if (!first || !second || first.type !== "pane" || second.type !== "pane")
			return;
		const swapped = swapPaneContents(root, first.id, second.id);
		expect(swapped.type).toBe("split");
	});
});
