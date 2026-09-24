import type { LayoutNode } from "#/lib/windowsTerminalLayout";

type TerminalPanePreviewProps = {
	node: LayoutNode;
	selectedPaneId: string | null;
	onSelectPane: (paneId: string) => void;
};

export default function TerminalPanePreview({
	node,
	selectedPaneId,
	onSelectPane,
}: TerminalPanePreviewProps) {
	if (node.type === "pane") {
		return (
			<button
				type="button"
				onClick={() => onSelectPane(node.id)}
				className={`min-h-[104px] flex-1 rounded-md border p-3 text-left font-mono text-xs transition ${selectedPaneId === node.id ? "border-cyan-300 ring-2 ring-cyan-300/50" : "border-slate-700 hover:border-slate-500"}`}
				style={{
					background: "#0d1117",
					boxShadow: node.tabColor ? `inset 3px 0 ${node.tabColor}` : undefined,
				}}
			>
				<span className="block truncate text-slate-100">
					{node.profileName || "Default profile"}
				</span>
				<span className="mt-2 block truncate text-slate-400">
					{node.startingDirectory || "~"}
				</span>
				<span className="mt-4 block text-slate-500">PS&gt; _</span>
			</button>
		);
	}
	return (
		<div
			className={`flex min-h-0 flex-1 gap-1 ${node.direction === "horizontal" ? "flex-row" : "flex-col"}`}
		>
			<div
				className="min-h-0 min-w-0 flex-1"
				style={{ flexGrow: 1 - node.ratio }}
			>
				<TerminalPanePreview
					node={node.first}
					selectedPaneId={selectedPaneId}
					onSelectPane={onSelectPane}
				/>
			</div>
			<div className="min-h-0 min-w-0 flex-1" style={{ flexGrow: node.ratio }}>
				<TerminalPanePreview
					node={node.second}
					selectedPaneId={selectedPaneId}
					onSelectPane={onSelectPane}
				/>
			</div>
		</div>
	);
}
