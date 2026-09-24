import ActionButton from "#/components/ActionButton/ActionButton";
import type { PaneNode, TerminalProfile } from "#/lib/windowsTerminalLayout";

type Props = {
	pane: PaneNode | null;
	profiles: TerminalProfile[];
	canRemove: boolean;
	onChange: (patch: Partial<PaneNode>) => void;
	onSplit: (direction: "horizontal" | "vertical") => void;
	onRemove: () => void;
};

export default function PaneEditor({
	pane,
	profiles,
	canRemove,
	onChange,
	onSplit,
	onRemove,
}: Props) {
	if (!pane)
		return (
			<div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
				<p className="text-sm text-[var(--sea-ink-soft)]">
					Select a pane in the preview.
				</p>
			</div>
		);
	return (
		<div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
			<h3 className="m-0 text-base font-semibold">Selected pane</h3>
			<label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
				Profile name
				<input
					list="terminal-profiles"
					value={pane.profileName ?? ""}
					onChange={(event) => {
						const profile = profiles.find(
							(item) => item.name === event.target.value,
						);
						onChange({
							profileName: event.target.value || null,
							profileGuid: profile?.guid ?? null,
						});
					}}
					className="mt-1 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-normal"
					placeholder="e.g. PowerShell"
				/>
			</label>
			<datalist id="terminal-profiles">
				{profiles.map((profile) => (
					<option key={profile.guid} value={profile.name} />
				))}
			</datalist>
			<label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
				Starting directory
				<input
					value={pane.startingDirectory}
					onChange={(event) =>
						onChange({ startingDirectory: event.target.value })
					}
					className="mt-1 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-sm font-normal"
					placeholder="C:\\Code"
				/>
			</label>
			<label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
				Saved directories
				<textarea
					value={pane.savedDirectories.join("\n")}
					onChange={(event) =>
						onChange({
							savedDirectories: event.target.value
								.split("\n")
								.map((directory) => directory.trim())
								.filter(Boolean),
						})
					}
					rows={3}
					className="mt-1 w-full resize-y rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-sm font-normal"
					placeholder={"C:\\Code\\project-a\nC:\\Code\\project-b"}
				/>
			</label>
			{pane.savedDirectories.length ? (
				<div className="mt-2 flex flex-wrap gap-1">
					{pane.savedDirectories.map((directory) => (
						<button
							type="button"
							key={directory}
							onClick={() => onChange({ startingDirectory: directory })}
							className="max-w-full truncate rounded bg-[var(--surface)] px-2 py-1 font-mono text-xs text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]"
						>
							Use {directory}
						</button>
					))}
				</div>
			) : null}
			<label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
				Pane title
				<input
					value={pane.title}
					onChange={(event) => onChange({ title: event.target.value })}
					className="mt-1 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-normal"
					placeholder="Optional title"
				/>
			</label>
			<label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
				Command line
				<input
					value={pane.commandLine}
					onChange={(event) => onChange({ commandLine: event.target.value })}
					className="mt-1 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-sm font-normal"
					placeholder="e.g. nvim ."
				/>
			</label>
			<label className="mt-3 flex items-center gap-2 text-sm text-[var(--sea-ink-soft)]">
				<input
					type="checkbox"
					checked={pane.appendCommandLine}
					onChange={(event) =>
						onChange({ appendCommandLine: event.target.checked })
					}
				/>
				Append command line to the selected profile
			</label>
			<label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
				Color scheme
				<input
					value={pane.colorScheme}
					onChange={(event) => onChange({ colorScheme: event.target.value })}
					className="mt-1 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-normal"
					placeholder="Campbell"
				/>
			</label>
			<label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
				Tab color
				<input
					type="color"
					value={
						/^#[0-9a-f]{6}$/i.test(pane.tabColor) ? pane.tabColor : "#4fb8b2"
					}
					onChange={(event) => onChange({ tabColor: event.target.value })}
					className="mt-1 block h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-1"
				/>
			</label>
			<div className="mt-4 flex flex-wrap gap-2">
				<ActionButton onClick={() => onSplit("horizontal")}>
					Split side-by-side
				</ActionButton>
				<ActionButton onClick={() => onSplit("vertical")}>
					Split stacked
				</ActionButton>
				<ActionButton disabled={!canRemove} onClick={onRemove}>
					Remove
				</ActionButton>
			</div>
		</div>
	);
}
