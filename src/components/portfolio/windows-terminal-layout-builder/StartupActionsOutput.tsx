import ActionButton from "#/components/ActionButton/ActionButton";

type Props = {
	output: string;
	original: string;
	onCopy: () => void;
	onDownload: () => void;
};
export default function StartupActionsOutput({
	output,
	original,
	onCopy,
	onDownload,
}: Props) {
	return (
		<div className="mt-6 grid gap-5 lg:grid-cols-2">
			<div>
				<div className="flex items-center justify-between">
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
						Generated startupActions
					</p>
					<ActionButton onClick={onCopy}>Copy</ActionButton>
				</div>
				<textarea
					readOnly
					value={output}
					rows={11}
					className="w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-3 font-mono text-xs"
				/>
			</div>
			<div>
				<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
					Change preview
				</p>
				<div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-3 text-xs">
					<p className="m-0 font-semibold text-[var(--sea-ink-soft)]">Before</p>
					<pre className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap font-mono text-red-700">
						{original || "(no startupActions)"}
					</pre>
					<p className="mt-3 mb-0 font-semibold text-[var(--sea-ink-soft)]">
						After
					</p>
					<pre className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap font-mono text-emerald-700">
						{output}
					</pre>
				</div>
				<div className="mt-3">
					<ActionButton onClick={onDownload}>
						Download modified settings.json
					</ActionButton>
				</div>
			</div>
		</div>
	);
}
