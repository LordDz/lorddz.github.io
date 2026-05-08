import type { ChangeEventHandler } from "react";

type FilePickerInputProps = {
	label: string;
	helperText?: string;
	selectedName?: string | null;
	onChange: ChangeEventHandler<HTMLInputElement>;
	accept?: string;
	allowDirectory?: boolean;
	disabled?: boolean;
};

export default function FilePickerInput({
	label,
	helperText,
	selectedName,
	onChange,
	accept,
	allowDirectory = false,
	disabled = false,
}: FilePickerInputProps) {
	return (
		<label className="block text-sm font-semibold text-[var(--sea-ink)]">
			{label}
			<input
				type="file"
				multiple
				accept={accept}
				disabled={disabled}
				{...(allowDirectory
					? ({ webkitdirectory: "" } as Record<string, string>)
					: {})}
				className="mt-1 block w-full cursor-pointer rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-2 text-xs text-[var(--sea-ink-soft)] transition-colors file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-[rgba(50,143,151,0.35)] file:bg-[rgba(79,184,178,0.16)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--lagoon-deep)] file:transition-colors hover:file:bg-[rgba(79,184,178,0.26)]"
				onChange={onChange}
			/>
			{selectedName ? (
				<span className="mt-1 block text-xs font-normal text-[var(--sea-ink-soft)]">
					{selectedName}
				</span>
			) : null}
			{helperText ? (
				<span className="mt-1 block text-xs font-normal text-[var(--sea-ink-soft)]">
					{helperText}
				</span>
			) : null}
		</label>
	);
}
