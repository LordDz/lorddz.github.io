export type TerminalProfile = { guid: string; name: string; color?: string };
export type PaneNode = {
	type: "pane";
	id: string;
	profileGuid: string | null;
	profileName: string | null;
	startingDirectory: string;
	title: string;
	tabColor: string;
};
export type SplitNode = {
	type: "split";
	id: string;
	direction: "horizontal" | "vertical";
	ratio: number;
	first: LayoutNode;
	second: LayoutNode;
};
export type LayoutNode = PaneNode | SplitNode;
export type TerminalTab = { id: string; root: LayoutNode };
export type TerminalLayout = { tabs: TerminalTab[] };
export type SettingsDocument = Record<string, unknown>;
let sequence = 0;
const id = (prefix: string) => `${prefix}-${++sequence}`;

export function createPane(value: Partial<PaneNode> = {}): PaneNode {
	return {
		type: "pane",
		id: id("pane"),
		profileGuid: null,
		profileName: null,
		startingDirectory: "",
		title: "",
		tabColor: "",
		...value,
	};
}
export function profilesFromSettings(
	settings: SettingsDocument,
): TerminalProfile[] {
	const raw = settings.profiles;
	const entries = Array.isArray(raw)
		? raw
		: raw &&
				typeof raw === "object" &&
				Array.isArray((raw as { list?: unknown }).list)
			? (raw as { list: unknown[] }).list
			: [];
	return entries.flatMap((item) => {
		if (!item || typeof item !== "object") return [];
		const profile = item as Record<string, unknown>;
		return typeof profile.guid === "string" && typeof profile.name === "string"
			? [
					{
						guid: profile.guid,
						name: profile.name,
						color:
							typeof profile.color === "string" ? profile.color : undefined,
					},
				]
			: [];
	});
}
export function createFreshLayout(
	profiles: TerminalProfile[] = [],
): TerminalLayout {
	const first = profiles[0];
	return {
		tabs: [
			{
				id: id("tab"),
				root: createPane(
					first ? { profileGuid: first.guid, profileName: first.name } : {},
				),
			},
		],
	};
}

function tokenize(source: string): string[] | null {
	const tokens: string[] = [];
	let token = "";
	let quote = "";
	for (const char of source.trim()) {
		if (char === '"' || char === "'") {
			if (quote === char) quote = "";
			else if (!quote) quote = char;
			else token += char;
			continue;
		}
		if (!quote && /\s/.test(char)) {
			if (token) tokens.push(token);
			token = "";
		} else token += char;
	}
	if (quote) return null;
	if (token) tokens.push(token);
	return tokens;
}
function commands(source: string): string[] | null {
	const result: string[] = [];
	let command = "";
	let quote = "";
	for (const char of source) {
		if (char === '"' || char === "'") {
			if (quote === char) quote = "";
			else if (!quote) quote = char;
			command += char;
			continue;
		}
		if (!quote && char === ";") {
			if (command.trim()) result.push(command.trim());
			command = "";
		} else command += char;
	}
	if (quote) return null;
	if (command.trim()) result.push(command.trim());
	return result;
}
function value(tokens: string[], index: number, option: string) {
	const next = tokens[index + 1];
	if (!next || next.startsWith("-"))
		throw new Error(`${option} needs a value.`);
	return next;
}
function parsePane(tokens: string[], profiles: TerminalProfile[]) {
	let profileName: string | null = null;
	let startingDirectory = "";
	let title = "";
	let tabColor = "";
	let direction: SplitNode["direction"] | undefined;
	let ratio: number | undefined;
	for (let index = 1; index < tokens.length; index += 1) {
		const token = tokens[index];
		if (token === "-p" || token === "--profile") {
			profileName = value(tokens, index, token);
			index++;
		} else if (token === "-d" || token === "--startingDirectory") {
			startingDirectory = value(tokens, index, token);
			index++;
		} else if (token === "--title") {
			title = value(tokens, index, token);
			index++;
		} else if (token === "--tabColor") {
			tabColor = value(tokens, index, token);
			index++;
		} else if (token === "-s" || token === "--size") {
			ratio = Number(value(tokens, index, token));
			if (!ratio || ratio <= 0 || ratio >= 1)
				throw new Error("Split size must be a number between 0 and 1.");
			index++;
		} else if (token === "-H" || token === "--horizontal")
			direction = "horizontal";
		else if (token === "-V" || token === "--vertical") direction = "vertical";
		else throw new Error(`Unsupported argument: ${token}`);
	}
	const profile = profiles.find(
		(item) => item.name === profileName || item.guid === profileName,
	);
	return {
		pane: createPane({
			profileGuid: profile?.guid ?? null,
			profileName: profile?.name ?? profileName,
			startingDirectory,
			title,
			tabColor,
		}),
		direction,
		ratio,
	};
}
function leaves(node: LayoutNode): PaneNode[] {
	return node.type === "pane"
		? [node]
		: [...leaves(node.first), ...leaves(node.second)];
}
function replace(
	node: LayoutNode,
	paneId: string,
	next: LayoutNode,
): LayoutNode {
	if (node.type === "pane") return node.id === paneId ? next : node;
	return {
		...node,
		first: replace(node.first, paneId, next),
		second: replace(node.second, paneId, next),
	};
}
export function parseStartupActions(
	source: string,
	profiles: TerminalProfile[],
): TerminalLayout {
	const sourceCommands = commands(source);
	if (!sourceCommands?.length) return createFreshLayout(profiles);
	const tabs: TerminalTab[] = [];
	let activeTab = -1;
	let activePane: string | null = null;
	for (const command of sourceCommands) {
		const tokens = tokenize(command);
		if (!tokens?.length)
			throw new Error("Could not read a command in startupActions.");
		const action = tokens[0].toLowerCase();
		if (action === "new-tab" || action === "nt") {
			const parsed = parsePane(tokens, profiles);
			tabs.push({ id: id("tab"), root: parsed.pane });
			activeTab = tabs.length - 1;
			activePane = parsed.pane.id;
			continue;
		}
		if (action === "split-pane" || action === "sp") {
			if (activeTab < 0 || !activePane)
				throw new Error("split-pane appears before a tab was opened.");
			const parsed = parsePane(tokens, profiles);
			const old = leaves(tabs[activeTab].root).find(
				(pane) => pane.id === activePane,
			);
			if (!old)
				throw new Error("Could not find the pane targeted by split-pane.");
			tabs[activeTab] = {
				...tabs[activeTab],
				root: replace(tabs[activeTab].root, old.id, {
					type: "split",
					id: id("split"),
					direction: parsed.direction ?? "vertical",
					ratio: parsed.ratio ?? 0.5,
					first: old,
					second: parsed.pane,
				}),
			};
			activePane = parsed.pane.id;
			continue;
		}
		if (action === "focus-tab" || action === "ft") {
			const target = tokens.findIndex(
				(token) => token === "-t" || token === "--target",
			);
			const tabIndex =
				target < 0 ? NaN : Number(value(tokens, target, "focus-tab target"));
			if (!Number.isInteger(tabIndex) || !tabs[tabIndex])
				throw new Error("focus-tab targets a tab that has not been created.");
			activeTab = tabIndex;
			activePane = leaves(tabs[tabIndex].root)[0]?.id ?? null;
			continue;
		}
		if (action === "move-focus" || action === "mf") {
			const direction = tokens[1];
			if (
				!activePane ||
				!["first", "nextInOrder", "previousInOrder"].includes(direction)
			)
				throw new Error(`Unsupported focus command: ${command}`);
			const ordered = leaves(tabs[activeTab].root);
			const current = ordered.findIndex((pane) => pane.id === activePane);
			const target =
				direction === "first"
					? 0
					: direction === "nextInOrder"
						? current + 1
						: current - 1;
			if (!ordered[target])
				throw new Error(
					`Focus command points outside the pane list: ${command}`,
				);
			activePane = ordered[target].id;
			continue;
		}
		throw new Error(`Unsupported startupActions command: ${tokens[0]}`);
	}
	return { tabs };
}
function quoted(text: string) {
	return `"${text.replaceAll('"', '\\"')}"`;
}
function args(pane: PaneNode, profiles: TerminalProfile[]) {
	const name =
		profiles.find((profile) => profile.guid === pane.profileGuid)?.name ??
		pane.profileName;
	return [
		name ? `-p ${quoted(name)}` : "",
		pane.startingDirectory ? `-d ${quoted(pane.startingDirectory)}` : "",
		pane.title ? `--title ${quoted(pane.title)}` : "",
		pane.tabColor ? `--tabColor ${quoted(pane.tabColor)}` : "",
	]
		.filter(Boolean)
		.join(" ");
}
function firstPane(node: LayoutNode): PaneNode {
	return node.type === "pane" ? node : firstPane(node.first);
}
export function generateStartupActions(
	layout: TerminalLayout,
	profiles: TerminalProfile[],
): string {
	const output: string[] = [];
	for (const tab of layout.tabs) {
		output.push(`new-tab ${args(firstPane(tab.root), profiles)}`.trim());
		const runtime = ["root"];
		let counter = 0;
		const focus = (target: string) => {
			const position = runtime.indexOf(target);
			output.push("move-focus first");
			for (let step = 0; step < position; step++)
				output.push("move-focus nextInOrder");
		};
		const build = (node: LayoutNode, target: string): void => {
			if (node.type === "pane") return;
			focus(target);
			output.push(
				`split-pane ${node.direction === "horizontal" ? "-H" : "-V"} --size ${node.ratio.toFixed(2)} ${args(firstPane(node.second), profiles)}`.trim(),
			);
			const second = `target-${counter++}`;
			runtime.push(second);
			build(node.first, target);
			build(node.second, second);
		};
		build(tab.root, "root");
	}
	return output.join(" ; ");
}
export function updatePane(node: LayoutNode, pane: PaneNode): LayoutNode {
	return replace(node, pane.id, pane);
}
export function splitPane(
	node: LayoutNode,
	paneId: string,
	direction: SplitNode["direction"],
	profiles: TerminalProfile[],
): LayoutNode {
	if (node.type === "pane") {
		if (node.id !== paneId) return node;
		const profile = profiles.find((item) => item.guid === node.profileGuid);
		return {
			type: "split",
			id: id("split"),
			direction,
			ratio: 0.5,
			first: node,
			second: createPane({
				profileGuid: node.profileGuid,
				profileName: profile?.name ?? node.profileName,
				startingDirectory: node.startingDirectory,
				title: node.title,
				tabColor: node.tabColor,
			}),
		};
	}
	return {
		...node,
		first: splitPane(node.first, paneId, direction, profiles),
		second: splitPane(node.second, paneId, direction, profiles),
	};
}
export function removePane(
	node: LayoutNode,
	paneId: string,
): LayoutNode | null {
	if (node.type === "pane") return node.id === paneId ? null : node;
	const first = removePane(node.first, paneId);
	const second = removePane(node.second, paneId);
	if (!first) return second;
	if (!second) return first;
	return { ...node, first, second };
}
export function findPane(
	layout: TerminalLayout,
	paneId: string | null,
): PaneNode | null {
	if (!paneId) return null;
	for (const tab of layout.tabs) {
		const found = leaves(tab.root).find((pane) => pane.id === paneId);
		if (found) return found;
	}
	return null;
}
