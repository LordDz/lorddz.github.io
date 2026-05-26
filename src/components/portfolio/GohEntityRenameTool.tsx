import ActionButton from "#/components/ActionButton/ActionButton";
import FilePickerInput from "#/components/FilePickerInput/FilePickerInput";
import { applyEntityRenames } from "#/lib/entityRename/applyEntityRenames";
import { isAcceptedEntityRenameFilename } from "#/lib/entityRename/fileAcceptance";
import { useSelector } from "@tanstack/react-store";
import JSZip from "jszip";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import {
	formatEntityRenamesText,
	parseEntityRenamesText,
} from "#/lib/entityRename/mappingText";

import {
	entityRenameStore,
	resetEntityRenameMappings,
	saveEntityRenameMappings,
} from "#/stores/entityRenameStore";

type AcceptedFile = {
	id: string;
	name: string;
	size: number;
	file: File;
};

type RejectedFile = {
	id: string;
	name: string;
	reason: string;
};

type ProcessedFile = {
	id: string;
	name: string;
	content: string;
	renamedCount: number;
	changed: boolean;
	entityChanges: Array<{
		from: string;
		to: string;
		count: number;
		lineNumbers: number[];
	}>;
};

function toKb(bytes: number) {
	return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString()} KB`;
}

async function buildProcessedFiles(
	accepted: AcceptedFile[],
	mappings: Record<string, string>,
) {
	const nextProcessed: ProcessedFile[] = [];

	for (const item of accepted) {
		const source = await item.file.text();

		const result = applyEntityRenames(source, mappings);

		nextProcessed.push({
			id: item.id,

			name: item.name,

			content: result.content,

			renamedCount: result.renamedCount,

			changed: result.renamedCount > 0,

			entityChanges: result.changedEntities,
		});
	}

	return nextProcessed;
}

type GohEntityRenameToolProps = {
	embedded?: boolean;
};

export default function GohEntityRenameTool({
	embedded = false,
}: GohEntityRenameToolProps) {
	const mappings = useSelector(entityRenameStore, (state) => state.mappings);

	const mappingCount = Object.keys(mappings).length;

	const [accepted, setAccepted] = useState<AcceptedFile[]>([]);

	const [rejected, setRejected] = useState<RejectedFile[]>([]);

	const [processed, setProcessed] = useState<ProcessedFile[]>([]);

	const [selectedFolderName, setSelectedFolderName] = useState<string | null>(
		null,
	);

	const [processing, setProcessing] = useState(false);

	const [downloadBusy, setDownloadBusy] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const [draftText, setDraftText] = useState(() =>
		formatEntityRenamesText(entityRenameStore.state.mappings),
	);

	const [mappingError, setMappingError] = useState<string | null>(null);

	const draftIsDirty = useRef(false);

	const shellClass = embedded
		? "mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5"
		: "rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6";

	useEffect(() => {
		if (draftIsDirty.current) return;

		setDraftText(formatEntityRenamesText(mappings));
	}, [mappings]);

	const reprocessAccepted = async (
		nextAccepted: AcceptedFile[],

		nextMappings: Record<string, string>,
	) => {
		if (nextAccepted.length === 0) {
			setProcessed([]);

			return;
		}

		setProcessing(true);

		try {
			setProcessed(await buildProcessedFiles(nextAccepted, nextMappings));
		} catch {
			setError("Could not read one or more selected files.");
		} finally {
			setProcessing(false);
		}
	};

	const processFiles = async (incoming: FileList | null) => {
		if (!incoming?.length) return;

		setError(null);

		setProcessed([]);

		setProcessing(true);

		const firstRelativePath = Array.from(incoming)

			.map((file) => file.webkitRelativePath)

			.find((path) => Boolean(path));

		const folderName = firstRelativePath?.split("/")[0]?.trim() || null;

		setSelectedFolderName(folderName);

		const nextAccepted: AcceptedFile[] = [];

		const nextRejected: RejectedFile[] = [];

		for (const file of Array.from(incoming)) {
			const id = `${file.name}-${file.size}-${file.lastModified}`;

			if (isAcceptedEntityRenameFilename(file.name)) {
				nextAccepted.push({ id, name: file.name, size: file.size, file });

				continue;
			}

			nextRejected.push({
				id,

				name: file.name,

				reason: "not a map or .mi file",
			});
		}

		setAccepted(nextAccepted);

		setRejected(nextRejected);

		try {
			setProcessed(await buildProcessedFiles(nextAccepted, mappings));
		} catch {
			setError("Could not read one or more selected files.");
		} finally {
			setProcessing(false);
		}
	};

	const onSaveMappings = () => {
		const { mappings: parsed, errors } = parseEntityRenamesText(draftText);

		if (errors.length > 0) {
			setMappingError(errors.join("\n"));

			return;
		}

		if (Object.keys(parsed).length === 0) {
			setMappingError("Add at least one mapping before saving.");

			return;
		}

		setMappingError(null);

		draftIsDirty.current = false;

		const formatted = formatEntityRenamesText(parsed);

		setDraftText(formatted);

		saveEntityRenameMappings(parsed);

		void reprocessAccepted(accepted, parsed);
	};

	const onResetMappings = () => {
		const defaults = resetEntityRenameMappings();

		draftIsDirty.current = false;

		setDraftText(formatEntityRenamesText(defaults));

		setMappingError(null);

		void reprocessAccepted(accepted, defaults);
	};

	const onPickFiles = (e: ChangeEvent<HTMLInputElement>) => {
		processFiles(e.target.files);

		e.target.value = "";
	};

	const onPickFolder = (e: ChangeEvent<HTMLInputElement>) => {
		processFiles(e.target.files);

		e.target.value = "";
	};

	const acceptedTotal = useMemo(
		() => accepted.reduce((sum, item) => sum + item.size, 0),

		[accepted],
	);

	const processedById = useMemo(
		() => new Map(processed.map((item) => [item.id, item])),

		[processed],
	);

	const processedSummary = useMemo(() => {
		const filesChanged = processed.filter((item) => item.changed).length;

		const totalRenames = processed.reduce(
			(sum, item) => sum + item.renamedCount,

			0,
		);

		return { filesChanged, totalRenames };
	}, [processed]);

	const downloadZip = async () => {
		if (processed.length === 0) return;

		setError(null);

		setDownloadBusy(true);

		try {
			const zip = new JSZip();

			for (const item of processed) {
				zip.file(item.name, item.content);
			}

			const blob = await zip.generateAsync({ type: "blob" });

			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");

			a.href = url;

			a.download = selectedFolderName
				? `${selectedFolderName}.zip`
				: "goh-entity-renamed-files.zip";

			a.click();

			URL.revokeObjectURL(url);
		} catch {
			setError("Could not generate ZIP archive.");
		} finally {
			setDownloadBusy(false);
		}
	};

	const changedEntitiesText = useMemo(() => {
		if (processed.length === 0) return "";

		const lines: string[] = [];

		for (const file of processed) {
			if (file.entityChanges.length === 0) continue;

			lines.push(file.name);

			for (const change of file.entityChanges) {
				lines.push(
					`- lines ${change.lineNumbers.join(", ")}: ${change.from} -> ${change.to} (${change.count})`,
				);
			}

			lines.push("");
		}

		return lines.length > 0
			? lines.join("\n").trimEnd()
			: "No entity text changes were made.";
	}, [processed]);

	return (
		<div className={shellClass}>
			{embedded ? null : (
				<>
					<p className="island-kicker mb-2">Gates of Hell</p>

					<h4 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
						Entity rename prep
					</h4>

					<p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
						Pick mission files and the unextensioned <code>map</code> file, then
						change entity text on <code>Entity "name"</code> definition lines
						only (filenames are not changed). Processing stays in your browser.
					</p>
				</>
			)}

			<div className={embedded ? "" : "mt-4"}>
				<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
					Rename rules ({mappingCount} saved)
				</p>

				<p className="mb-2 text-sm text-[var(--sea-ink-soft)]">
					One mapping per line: <code>old_name -&gt; new_name</code> or{" "}
					<code>old_name renamed to new_name</code>. Lines with{" "}
					<code>deleted</code> and <code>#</code> comments are ignored. Saved
					rules persist in this browser.
				</p>

				<textarea
					className="min-h-[180px] w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-mono text-xs text-[var(--sea-ink)]"
					value={draftText}
					onChange={(e) => {
						draftIsDirty.current = true;

						setDraftText(e.target.value);

						setMappingError(null);
					}}
					rows={12}
					spellCheck={false}
				/>

				<div className="mt-2 flex flex-wrap items-center gap-2">
					<ActionButton onClick={onSaveMappings}>Save rules</ActionButton>

					<ActionButton onClick={onResetMappings}>
						Reset to defaults
					</ActionButton>
				</div>

				{mappingError ? (
					<pre
						className="mt-2 whitespace-pre-wrap rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-mono text-xs text-red-700"
						role="alert"
					>
						{mappingError}
					</pre>
				) : null}
			</div>

			<div
				className={`grid gap-4 sm:grid-cols-2 ${embedded ? "mt-4" : "mt-6"}`}
			>
				<FilePickerInput
					label="Pick folder"
					helperText="Includes every file in the folder, then filters to map + .mi."
					allowDirectory
					onChange={onPickFolder}
				/>

				<FilePickerInput
					label="Pick files (if pick folder doesn't work)"
					helperText="Hint: this dialog defaults to .mi; switch to all files to include map."
					accept=".mi"
					onChange={onPickFiles}
				/>
			</div>

			<div className="mt-4 flex flex-wrap items-center gap-2">
				<ActionButton
					disabled={downloadBusy || processing || processed.length === 0}
					onClick={downloadZip}
				>
					{downloadBusy ? "Building ZIP…" : "Download ZIP"}
				</ActionButton>

				<span className="text-xs text-[var(--sea-ink-soft)]">
					Accepted: {accepted.length} file(s) ({toKb(acceptedTotal)})
				</span>

				{processing ? (
					<span className="text-xs text-[var(--sea-ink-soft)]">
						Changing texts…
					</span>
				) : null}
			</div>

			{processed.length > 0 ? (
				<p className="mt-2 text-xs text-[var(--sea-ink-soft)]">
					Processed {processed.length} file(s): {processedSummary.filesChanged}{" "}
					file(s) changed, {processedSummary.totalRenames} total text change(s).
				</p>
			) : null}

			{error ? (
				<p className="mt-2 text-sm text-red-600" role="alert">
					{error}
				</p>
			) : null}

			<div className="mt-4">
				<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
					Changed entities
				</p>

				<textarea
					readOnly
					className="min-h-[140px] w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-mono text-xs text-[var(--sea-ink)]"
					value={changedEntitiesText}
					rows={10}
				/>
			</div>

			<div className="mt-4 grid gap-4 lg:grid-cols-2">
				<div>
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
						Skipped
					</p>

					{rejected.length === 0 ? (
						<p className="text-sm text-[var(--sea-ink-soft)]">
							No skipped files.
						</p>
					) : (
						<ul className="space-y-2 text-sm text-[var(--sea-ink)]">
							{rejected.map((item) => (
								<li
									key={item.id}
									className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2"
								>
									<span className="font-medium">{item.name}</span>

									<span className="ml-2 text-xs text-[var(--sea-ink-soft)]">
										{item.reason}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>

				<div>
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
						Accepted
					</p>

					{accepted.length === 0 ? (
						<p className="text-sm text-[var(--sea-ink-soft)]">
							No files selected yet.
						</p>
					) : (
						<ul className="space-y-2 text-sm text-[var(--sea-ink)]">
							{accepted.map((item) => (
								<li
									key={item.id}
									className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2"
								>
									<span className="font-medium">{item.name}</span>

									<span className="ml-2 text-xs text-[var(--sea-ink-soft)]">
										{toKb(item.size)}
									</span>

									{processedById.get(item.id) ? (
										<span className="ml-2 text-xs text-[var(--sea-ink-soft)]">
											· {processedById.get(item.id)?.renamedCount ?? 0} text
											change(s)
										</span>
									) : null}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
