import ActionButton from "#/components/ActionButton/ActionButton";

type LayoutPresetsProps = {
	onChoose: (preset: "columns" | "mainStack" | "grid") => void;
};

export default function LayoutPresets({ onChoose }: LayoutPresetsProps) {
	return (
		<div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
			<p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
				Quick-start layouts
			</p>
			<div className="mt-3 flex flex-wrap gap-2">
				<ActionButton onClick={() => onChoose("columns")}>
					Two columns
				</ActionButton>
				<ActionButton onClick={() => onChoose("mainStack")}>
					Main + stack
				</ActionButton>
				<ActionButton onClick={() => onChoose("grid")}>2 × 2 grid</ActionButton>
			</div>
			<p className="mb-0 mt-2 text-xs text-[var(--sea-ink-soft)]">
				Choosing a preset replaces the current local layout.
			</p>
		</div>
	);
}
