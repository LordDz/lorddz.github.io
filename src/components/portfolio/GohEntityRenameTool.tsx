import { type ChangeEvent, useMemo, useState } from "react";

import ActionButton from "#/components/ActionButton/ActionButton";
import FilePickerInput from "#/components/FilePickerInput/FilePickerInput";

type AcceptedFile = {
	id: string;
	name: string;
	size: number;
};

type RejectedFile = {
	id: string;
	name: string;
	reason: string;
};

function isAcceptedFile(file: File) {
	const name = file.name.toLowerCase();
	return name === "map" || name.endsWith(".mi");
}

function toKb(bytes: number) {
	return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString()} KB`;
}

type GohEntityRenameToolProps = {
	embedded?: boolean;
};

export default function GohEntityRenameTool({
	embedded = false,
}: GohEntityRenameToolProps) {
	const [accepted, setAccepted] = useState<AcceptedFile[]>([]);
	const [rejected, setRejected] = useState<RejectedFile[]>([]);

	const shellClass = embedded
		? "mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5"
		: "rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6";

	const processFiles = (incoming: FileList | null) => {
		if (!incoming?.length) return;
		const nextAccepted: AcceptedFile[] = [];
		const nextRejected: RejectedFile[] = [];
		for (const file of Array.from(incoming)) {
			const id = `${file.name}-${file.size}-${file.lastModified}`;
			if (isAcceptedFile(file)) {
				nextAccepted.push({ id, name: file.name, size: file.size });
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

	return (
		<div className={shellClass}>
			{embedded ? null : (
				<>
					<p className="island-kicker mb-2">Gates of Hell</p>
					<h4 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
						Entity rename prep
					</h4>
					<p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
						Pick mission files and the unextensioned <code>map</code> file. This
						step only validates and lists files to process; rename logic and export
						will be added in later steps.
					</p>
				</>
			)}

			<div className={`grid gap-4 sm:grid-cols-2 ${embedded ? "" : "mt-4"}`}>
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
					onClick={() => {
						setAccepted([]);
						setRejected([]);
					}}
				>
					Clear
				</ActionButton>
				<span className="text-xs text-[var(--sea-ink-soft)]">
					Accepted: {accepted.length} file(s) ({toKb(acceptedTotal)})
				</span>
			</div>

			<div className="mt-4 grid gap-4 lg:grid-cols-2">
				<div>
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
						Accepted
					</p>
					{accepted.length === 0 ? (
						<p className="text-sm text-[var(--sea-ink-soft)]">No files selected yet.</p>
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
								</li>
							))}
						</ul>
					)}
				</div>

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
			</div>
		</div>
	);
}
