import { type ChangeEvent, useCallback, useState } from "react";

import { buildMergeResult } from "#/lib/miMerge/mergeMi";

const LARGE_BYTES = 15 * 1024 * 1024;

function readFileText(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result ?? ""));
		r.onerror = () => reject(r.error ?? new Error("Read failed"));
		r.readAsText(file);
	});
}

const textareaClass =
	"mt-1 min-h-[140px] w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-mono text-xs text-[var(--sea-ink)]";

type GohMiMergeToolProps = {
	/** Omit standalone title block when nested in a project card */
	embedded?: boolean;
};

export default function GohMiMergeTool({
	embedded = false,
}: GohMiMergeToolProps) {
	const [referenceName, setReferenceName] = useState<string | null>(null);
	const [targetName, setTargetName] = useState<string | null>(null);
	const [referenceText, setReferenceText] = useState<string | null>(null);
	const [targetText, setTargetText] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [warnings, setWarnings] = useState<string[]>([]);
	const [preview, setPreview] = useState<{
		vars: string;
		triggers: string;
		entities: string;
	} | null>(null);
	const [outputText, setOutputText] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	const onPickReference = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			const f = e.target.files?.[0];
			e.target.value = "";
			if (!f) return;
			setError(null);
			setPreview(null);
			setOutputText(null);
			setWarnings([]);
			if (f.size > LARGE_BYTES) {
				setError(
					`Reference file is large (${Math.round(f.size / (1024 * 1024))} MB). The browser may freeze briefly while merging.`,
				);
			}
			setReferenceName(f.name);
			setBusy(true);
			try {
				setReferenceText(await readFileText(f));
			} catch {
				setError("Could not read reference file.");
				setReferenceName(null);
				setReferenceText(null);
			} finally {
				setBusy(false);
			}
		},
		[],
	);

	const onPickTarget = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		e.target.value = "";
		if (!f) return;
		setError(null);
		setPreview(null);
		setOutputText(null);
		setWarnings([]);
		if (f.size > LARGE_BYTES) {
			setError(
				`Target file is large (${Math.round(f.size / (1024 * 1024))} MB). The browser may freeze briefly while merging.`,
			);
		}
		setTargetName(f.name);
		setBusy(true);
		try {
			setTargetText(await readFileText(f));
		} catch {
			setError("Could not read target file.");
			setTargetName(null);
			setTargetText(null);
		} finally {
			setBusy(false);
		}
	}, []);

	const runMerge = useCallback(() => {
		setError(null);
		setWarnings([]);
		setPreview(null);
		setOutputText(null);
		if (!referenceText || !targetText) {
			setError("Choose both a reference .mi and a target .mi.");
			return;
		}
		setBusy(true);
		try {
			const result = buildMergeResult(referenceText, targetText);
			if (!result.ok) {
				setError(result.error);
				return;
			}
			setPreview(result.preview);
			setOutputText(result.outputText);
			setWarnings(result.warnings);
		} finally {
			setBusy(false);
		}
	}, [referenceText, targetText]);

	const downloadMerged = useCallback(() => {
		if (!outputText || !targetName) return;
		const base = targetName.replace(/\.mi$/i, "") || "merged";
		const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${base}_merged.mi`;
		a.click();
		URL.revokeObjectURL(url);
	}, [outputText, targetName]);

	const shellClass = embedded
		? "mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5"
		: "rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6";

	return (
		<div className={shellClass}>
			{embedded ? null : (
				<>
					<p className="island-kicker mb-2">Gates of Hell</p>
					<h4 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
						Mission (.mi) merge
					</h4>
					<p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
						Upload a <strong>reference</strong> mission (vars, triggers,
						entities you want) and a <strong>target</strong> map to patch. The
						tool inserts reference entities (and matching{" "}
						<code className="text-[11px]">Tags</code> lines) before{" "}
						<code className="text-[11px]">{"{Helpers}"}</code>, replaces{" "}
						<code className="text-[11px]">{"{vars}"}</code> and{" "}
						<code className="text-[11px]">{"{triggers}"}</code> inside the
						target’s Helpers with the reference versions, and renumbers
						reference entity hex ids that collide with the target (remap is
						applied consistently in vars, triggers, entities, and tags).
						Processing stays in your browser.
					</p>
				</>
			)}
			<p
				className={`text-xs text-[var(--sea-ink-soft)] ${embedded ? "mb-3" : "mt-2"}`}
			>
				Assumption: merged triggers still make sense for entity ids present in
				the target plus the appended reference entities. A warning lists some
				hex tokens in triggers that do not appear on any mission-level Entity
				line—review before shipping.
			</p>

			<div className={`flex flex-wrap gap-4 ${embedded ? "" : "mt-4"}`}>
				<label className="block text-sm font-semibold text-[var(--sea-ink)]">
					Reference .mi
					<input
						type="file"
						accept=".mi,text/plain"
						disabled={busy}
						className="mt-1 block text-xs text-[var(--sea-ink-soft)]"
						onChange={onPickReference}
					/>
					{referenceName ? (
						<span className="mt-1 block text-xs font-normal text-[var(--sea-ink-soft)]">
							{referenceName}
						</span>
					) : null}
				</label>
				<label className="block text-sm font-semibold text-[var(--sea-ink)]">
					Target .mi
					<input
						type="file"
						accept=".mi,text/plain"
						disabled={busy}
						className="mt-1 block text-xs text-[var(--sea-ink-soft)]"
						onChange={onPickTarget}
					/>
					{targetName ? (
						<span className="mt-1 block text-xs font-normal text-[var(--sea-ink-soft)]">
							{targetName}
						</span>
					) : null}
				</label>
			</div>

			<button
				type="button"
				disabled={busy || !referenceText || !targetText}
				className="mt-4 rounded-full border border-[rgba(50,143,151,0.35)] bg-[rgba(79,184,178,0.16)] px-5 py-2 text-sm font-semibold text-[var(--lagoon-deep)] transition enabled:hover:bg-[rgba(79,184,178,0.26)] disabled:opacity-50"
				onClick={runMerge}
			>
				{busy ? "Working…" : "Preview & merge"}
			</button>

			{error ? (
				<p className="mt-3 text-sm text-red-600" role="alert">
					{error}
				</p>
			) : null}
			{warnings.length > 0 ? (
				<ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-amber-800 dark:text-amber-200">
					{warnings.map((w) => (
						<li key={w.slice(0, 80)}>{w}</li>
					))}
				</ul>
			) : null}

			{preview ? (
				<div className="mt-6 space-y-4">
					<div>
						<label
							htmlFor="goh-mi-preview-vars"
							className="block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]"
						>
							{"{vars}"} (merged into target Helpers)
						</label>
						<textarea
							id="goh-mi-preview-vars"
							readOnly
							className={textareaClass}
							value={preview.vars}
							rows={8}
						/>
					</div>
					<div>
						<label
							htmlFor="goh-mi-preview-triggers"
							className="block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]"
						>
							{"{triggers}"} (merged into target Helpers)
						</label>
						<textarea
							id="goh-mi-preview-triggers"
							readOnly
							className={textareaClass}
							value={preview.triggers}
							rows={12}
						/>
					</div>
					<div>
						<label
							htmlFor="goh-mi-preview-entities"
							className="block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]"
						>
							{"{entities}"} + matching Tags (prepended before Helpers)
						</label>
						<textarea
							id="goh-mi-preview-entities"
							readOnly
							className={textareaClass}
							value={preview.entities}
							rows={10}
						/>
					</div>
					<button
						type="button"
						disabled={!outputText}
						className="rounded-full border border-[rgba(47,106,74,0.4)] bg-[rgba(47,106,74,0.12)] px-5 py-2 text-sm font-semibold text-[var(--lagoon-deep)] transition enabled:hover:bg-[rgba(47,106,74,0.2)] disabled:opacity-50"
						onClick={downloadMerged}
					>
						Download merged .mi
					</button>
				</div>
			) : null}
		</div>
	);
}
