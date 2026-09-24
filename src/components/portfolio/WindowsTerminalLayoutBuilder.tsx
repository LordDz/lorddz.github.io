import {
	type ChangeEvent,
	type DragEvent,
	useMemo,
	useRef,
	useState,
} from "react";
import ActionButton from "#/components/ActionButton/ActionButton";
import {
	createFreshLayout,
	findPane,
	generateStartupActions,
	type PaneNode,
	parseStartupActions,
	profilesFromSettings,
	removePane,
	type SettingsDocument,
	splitPane,
	type TerminalLayout,
	type TerminalProfile,
	updatePane,
} from "#/lib/windowsTerminalLayout";
import PaneEditor from "./windows-terminal-layout-builder/PaneEditor";
import StartupActionsOutput from "./windows-terminal-layout-builder/StartupActionsOutput";
import TerminalPreview from "./windows-terminal-layout-builder/TerminalPreview";

function parseSettingsText(source: string): SettingsDocument {
	let cleaned = "";
	let quote = "";
	let lineComment = false;
	let blockComment = false;
	for (let index = 0; index < source.length; index += 1) {
		const char = source[index];
		const next = source[index + 1];
		if (lineComment) {
			if (char === "\n") {
				lineComment = false;
				cleaned += char;
			}
			continue;
		}
		if (blockComment) {
			if (char === "*" && next === "/") {
				blockComment = false;
				index += 1;
			}
			continue;
		}
		if (!quote && char === "/" && next === "/") {
			lineComment = true;
			index += 1;
			continue;
		}
		if (!quote && char === "/" && next === "*") {
			blockComment = true;
			index += 1;
			continue;
		}
		if (char === '"' && source[index - 1] !== "\\") quote = quote ? "" : '"';
		cleaned += char;
	}
	return JSON.parse(cleaned.replace(/,(\s*[}\]])/g, "$1")) as SettingsDocument;
}

export default function WindowsTerminalLayoutBuilder() {
	const [settings, setSettings] = useState<SettingsDocument>({});
	const [originalStartupActions, setOriginalStartupActions] = useState("");
	const [profiles, setProfiles] = useState<TerminalProfile[]>([]);
	const [layout, setLayout] = useState<TerminalLayout>(() =>
		createFreshLayout(),
	);
	const [selectedPane, setSelectedPane] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState(0);
	const [fileName, setFileName] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const output = useMemo(
		() => generateStartupActions(layout, profiles),
		[layout, profiles],
	);
	const pane = findPane(layout, selectedPane);
	const currentTab = layout.tabs[activeTab];
	const updateSelected = (patch: Partial<PaneNode>) => {
		if (!pane) return;
		const next = { ...pane, ...patch };
		setLayout((current) => ({
			tabs: current.tabs.map((tab) => ({
				...tab,
				root: updatePane(tab.root, next),
			})),
		}));
	};
	const importFile = async (file: File) => {
		setError(null);
		setNotice(null);
		try {
			const parsed = parseSettingsText(await file.text());
			if (!parsed || Array.isArray(parsed))
				throw new Error("The file must contain a settings.json object.");
			const nextProfiles = profilesFromSettings(parsed);
			const startup =
				typeof parsed.startupActions === "string" ? parsed.startupActions : "";
			const nextLayout = parseStartupActions(startup, nextProfiles);
			setSettings(parsed);
			setProfiles(nextProfiles);
			setOriginalStartupActions(startup);
			setLayout(nextLayout);
			setActiveTab(0);
			setSelectedPane(null);
			setFileName(file.name);
			setNotice(
				`Loaded ${file.name}. ${nextProfiles.length} profile(s) found.`,
			);
		} catch (cause) {
			setError(
				cause instanceof Error
					? `Could not import this file: ${cause.message}`
					: "Could not import this file.",
			);
		}
	};
	const startFresh = () => {
		const next = createFreshLayout(profiles);
		setSettings({});
		setOriginalStartupActions("");
		setLayout(next);
		setSelectedPane(
			next.tabs[0]?.root.type === "pane" ? next.tabs[0].root.id : null,
		);
		setActiveTab(0);
		setFileName(null);
		setError(null);
		setNotice(
			"Starting with a local blank layout. Add a profile name manually or import settings.json.",
		);
	};
	const download = () => {
		const next = JSON.parse(JSON.stringify(settings)) as SettingsDocument;
		next.startupActions = output;
		const blob = new Blob([`${JSON.stringify(next, null, 2)}\n`], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = fileName?.replace(/\.json$/i, "")
			? `${fileName.replace(/\.json$/i, "")}-layout.json`
			: "settings.json";
		link.click();
		URL.revokeObjectURL(url);
	};
	const onFile = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (file) void importFile(file);
	};
	const onDrop = (event: DragEvent<HTMLElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file) void importFile(file);
	};
	return (
		<section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="island-kicker mb-2">Windows Terminal</p>
					<h2 className="m-0 text-xl font-semibold text-[var(--sea-ink)]">
						Layout Builder
					</h2>
					<p className="mt-2 max-w-2xl text-sm text-[var(--sea-ink-soft)]">
						Build tabs and pane splits without hand-writing{" "}
						<code>startupActions</code>. Your settings file stays in this
						browser—nothing is uploaded.
					</p>
				</div>
				<div className="flex gap-2">
					<ActionButton onClick={() => inputRef.current?.click()}>
						Choose settings.json
					</ActionButton>
					<ActionButton onClick={startFresh}>Start from scratch</ActionButton>
				</div>
			</div>
			<input
				ref={inputRef}
				className="hidden"
				type="file"
				accept="application/json,.json"
				onChange={onFile}
			/>
			<section
				aria-label="Drop settings.json here"
				onDragOver={(event) => event.preventDefault()}
				onDrop={onDrop}
				className="mt-4 rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-center text-sm text-[var(--sea-ink-soft)]"
			>
				Drop a Windows Terminal <code>settings.json</code> here, or start with a
				blank local layout.
			</section>
			{error ? (
				<p
					role="alert"
					className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
				>
					{error} The original file has not been changed.
				</p>
			) : null}
			{notice ? (
				<p className="mt-3 text-sm text-[var(--sea-ink-soft)]">{notice}</p>
			) : null}
			<div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
				<TerminalPreview
					layout={layout}
					profiles={profiles}
					activeTab={activeTab}
					selectedPaneId={selectedPane}
					onSelectTab={setActiveTab}
					onSelectPane={setSelectedPane}
					onAddTab={(tab) => {
						setLayout((current) => ({ tabs: [...current.tabs, tab] }));
						setActiveTab(layout.tabs.length);
						setSelectedPane(tab.root.id);
					}}
				/>
				<PaneEditor
					pane={pane}
					profiles={profiles}
					canRemove={currentTab?.root.type !== "pane"}
					onChange={updateSelected}
					onSplit={(direction) => {
						if (!pane) return;
						setLayout((current) => ({
							tabs: current.tabs.map((tab) => ({
								...tab,
								root: splitPane(tab.root, pane.id, direction, profiles),
							})),
						}));
					}}
					onRemove={() => {
						if (!currentTab || !pane) return;
						const root = removePane(currentTab.root, pane.id);
						if (root)
							setLayout((current) => ({
								tabs: current.tabs.map((tab, index) =>
									index === activeTab ? { ...tab, root } : tab,
								),
							}));
						setSelectedPane(null);
					}}
				/>
			</div>
			<StartupActionsOutput
				output={output}
				original={originalStartupActions}
				onCopy={() =>
					void navigator.clipboard
						.writeText(output)
						.then(() => setNotice("Copied startupActions."))
				}
				onDownload={download}
			/>
			<details className="mt-6 text-sm text-[var(--sea-ink-soft)]">
				<summary className="cursor-pointer font-semibold text-[var(--sea-ink)]">
					V1 support and safety
				</summary>
				<p>
					This version reads and writes tabs plus <code>new-tab</code>,{" "}
					<code>split-pane</code>, <code>focus-tab</code>, and deterministic{" "}
					<code>move-focus</code> commands. It preserves profile GUIDs in your
					settings file and resolves profile names when generating commands. It
					deliberately stops on custom command lines, directional focus,
					move/swap pane, duplicate panes, schemes, and other commands it cannot
					round-trip safely.
				</p>
			</details>
		</section>
	);
}
