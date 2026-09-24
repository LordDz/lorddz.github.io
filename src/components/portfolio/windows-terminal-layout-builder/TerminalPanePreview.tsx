import type { PointerEvent as ReactPointerEvent } from "react";
import type { LayoutNode } from "#/lib/windowsTerminalLayout";

type TerminalPanePreviewProps = {
	node: LayoutNode;
	selectedPaneId: string | null;
	onSelectPane: (paneId: string) => void;
	onSwapPanes: (firstId: string, secondId: string) => void;
	onRatioChange: (splitId: string, ratio: number) => void;
};

export default function TerminalPanePreview({
	node,
	selectedPaneId,
	onSelectPane,
	onSwapPanes,
	onRatioChange,
}: TerminalPanePreviewProps) {
	if (node.type === "pane") {
		return (
			<button
				type="button"
				draggable
				onDragStart={(event) => {
					event.dataTransfer.setData("application/x-terminal-pane", node.id);
					event.dataTransfer.effectAllowed = "move";
				}}
				onDragOver={(event) => event.preventDefault()}
				onDrop={(event) => {
					event.preventDefault();
					const source = event.dataTransfer.getData(
						"application/x-terminal-pane",
					);
					if (source) onSwapPanes(source, node.id);
				}}
				onClick={() => onSelectPane(node.id)}
				className={`min-h-[104px] flex-1 rounded-md border p-3 text-left font-mono text-xs transition ${selectedPaneId === node.id ? "border-cyan-300 ring-2 ring-cyan-300/50" : "border-slate-700 hover:border-slate-500"}`}
				style={{
					background: "#0d1117",
					boxShadow: node.tabColor ? `inset 3px 0 ${node.tabColor}` : undefined,
				}}
			>
				<span className="block truncate text-slate-100">
					{node.title || node.profileName || "Default profile"}
				</span>
				<span className="mt-2 block truncate text-slate-400">
					{node.startingDirectory || "~"}
				</span>
				<span className="mt-4 block truncate text-slate-500">
					{node.commandLine || "PS> _"}
				</span>
			</button>
		);
	}
	const resize = (event: ReactPointerEvent<HTMLDivElement>) => {
		const container = event.currentTarget.parentElement;
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const apply = (pointer: globalThis.PointerEvent) => {
			const size = node.direction === "horizontal" ? rect.width : rect.height;
			const position =
				node.direction === "horizontal"
					? pointer.clientX - rect.left
					: pointer.clientY - rect.top;
			onRatioChange(node.id, position / size);
		};
		apply(event.nativeEvent);
		const finish = () => {
			window.removeEventListener("pointermove", apply);
			window.removeEventListener("pointerup", finish);
		};
		window.addEventListener("pointermove", apply);
		window.addEventListener("pointerup", finish);
	};
	return (
		<div
			className={`flex min-h-0 flex-1 ${node.direction === "horizontal" ? "flex-row" : "flex-col"}`}
		>
			<div
				className="min-h-0 min-w-0"
				style={{ flexGrow: node.ratio, flexBasis: 0 }}
			>
				<TerminalPanePreview
					node={node.first}
					selectedPaneId={selectedPaneId}
					onSelectPane={onSelectPane}
					onSwapPanes={onSwapPanes}
					onRatioChange={onRatioChange}
				/>
			</div>
			{/* biome-ignore lint/a11y/useSemanticElements: A resizable divider needs a non-semantic, pointer-sized hit target. */}
			<div
				role="separator"
				aria-orientation={
					node.direction === "horizontal" ? "vertical" : "horizontal"
				}
				aria-valuemin={15}
				aria-valuemax={85}
				aria-valuenow={Math.round(node.ratio * 100)}
				tabIndex={0}
				onPointerDown={resize}
				className={`z-10 shrink-0 touch-none bg-slate-700/80 transition hover:bg-cyan-300 ${node.direction === "horizontal" ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize"}`}
			/>
			<div
				className="min-h-0 min-w-0"
				style={{ flexGrow: 1 - node.ratio, flexBasis: 0 }}
			>
				<TerminalPanePreview
					node={node.second}
					selectedPaneId={selectedPaneId}
					onSelectPane={onSelectPane}
					onSwapPanes={onSwapPanes}
					onRatioChange={onRatioChange}
				/>
			</div>
		</div>
	);
}
