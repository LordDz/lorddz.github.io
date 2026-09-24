import {
	createPane,
	type TerminalLayout,
	type TerminalProfile,
} from "#/lib/windowsTerminalLayout";
import TerminalPanePreview from "./TerminalPanePreview";

type TerminalPreviewProps = {
	layout: TerminalLayout;
	profiles: TerminalProfile[];
	activeTab: number;
	selectedPaneId: string | null;
	onSelectTab: (index: number) => void;
	onSelectPane: (paneId: string) => void;
	onAddTab: (tab: TerminalLayout["tabs"][number]) => void;
	onSwapPanes: (firstId: string, secondId: string) => void;
	onRatioChange: (splitId: string, ratio: number) => void;
};

export default function TerminalPreview({
	layout,
	profiles,
	activeTab,
	selectedPaneId,
	onSelectTab,
	onSelectPane,
	onAddTab,
	onSwapPanes,
	onRatioChange,
}: TerminalPreviewProps) {
	const currentTab = layout.tabs[activeTab];
	return (
		<div>
			<div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-inner">
				<div className="flex overflow-x-auto border-b border-slate-700 bg-slate-900 px-2 pt-2">
					{layout.tabs.map((tab, index) => (
						<button
							type="button"
							key={tab.id}
							onClick={() => onSelectTab(index)}
							className={`min-w-32 rounded-t-md px-4 py-2 text-left text-xs ${activeTab === index ? "bg-slate-950 text-white" : "bg-slate-800 text-slate-400"}`}
						>
							Tab {index + 1}
						</button>
					))}
					<button
						type="button"
						className="px-3 text-slate-300"
						onClick={() =>
							onAddTab({
								id: `tab-${Date.now()}`,
								root: createPane(
									profiles[0]
										? {
												profileGuid: profiles[0].guid,
												profileName: profiles[0].name,
											}
										: {},
								),
							})
						}
					>
						+
					</button>
				</div>
				<div className="flex min-h-[350px] gap-1 p-2">
					{currentTab ? (
						<TerminalPanePreview
							node={currentTab.root}
							selectedPaneId={selectedPaneId}
							onSelectPane={onSelectPane}
							onSwapPanes={onSwapPanes}
							onRatioChange={onRatioChange}
						/>
					) : null}
				</div>
			</div>
			<p className="mt-2 text-xs text-[var(--sea-ink-soft)]">
				Click a pane to edit it, drag one pane onto another to swap their
				contents, or drag a divider to resize a split.
			</p>
		</div>
	);
}
