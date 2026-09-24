import { useRef, useState } from "react";
import ActionButton from "#/components/ActionButton/ActionButton";
import { exportLayout, type TerminalLayout } from "#/lib/windowsTerminalLayout";

type LayoutExchangeProps = {
	layout: TerminalLayout;
	onImport: (layout: TerminalLayout) => void;
	onNotice: (message: string) => void;
	onError: (message: string) => void;
};

function validLayout(value: unknown): value is TerminalLayout {
	return (
		Boolean(value) &&
		typeof value === "object" &&
		Array.isArray((value as TerminalLayout).tabs)
	);
}

function readSharedLayout(value: string): TerminalLayout {
	const encoded = value.includes("#wt-layout=")
		? value.split("#wt-layout=")[1]
		: value;
	const bytes = Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0));
	const parsed = JSON.parse(new TextDecoder().decode(bytes)) as {
		version?: unknown;
		layout?: unknown;
	};
	if (parsed.version !== 1 || !validLayout(parsed.layout))
		throw new Error("This is not a supported Layout Builder share link.");
	return parsed.layout;
}

export default function LayoutExchange({
	layout,
	onImport,
	onNotice,
	onError,
}: LayoutExchangeProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [sharedLayout, setSharedLayout] = useState("");
	const download = () => {
		const blob = new Blob(
			[`${JSON.stringify(exportLayout(layout), null, 2)}\n`],
			{
				type: "application/json",
			},
		);
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "windows-terminal-layout.json";
		link.click();
		URL.revokeObjectURL(url);
	};
	const importFile = async (file: File) => {
		try {
			const parsed = JSON.parse(await file.text()) as {
				version?: unknown;
				layout?: unknown;
			};
			if (parsed.version !== 1 || !validLayout(parsed.layout))
				throw new Error("This is not a supported Layout Builder export.");
			onImport(parsed.layout);
			onNotice(`Imported ${file.name} locally.`);
		} catch (cause) {
			onError(
				cause instanceof Error ? cause.message : "Could not import layout.",
			);
		}
	};
	const share = async () => {
		const bytes = new TextEncoder().encode(
			JSON.stringify(exportLayout(layout, false)),
		);
		const encoded = btoa(String.fromCharCode(...bytes));
		const url = new URL(window.location.href);
		url.hash = `wt-layout=${encoded}`;
		try {
			await navigator.clipboard.writeText(url.toString());
			onNotice("Copied a share link without profile GUIDs or directory paths.");
		} catch {
			onError(
				"Could not copy the share link. Your browser may block clipboard access.",
			);
		}
	};
	return (
		<section className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h3 className="m-0 text-base font-semibold">Layout exchange</h3>
					<p className="mb-0 mt-1 text-xs text-[var(--sea-ink-soft)]">
						Export keeps names and pane settings but omits profile GUIDs. Share
						links also remove directory paths.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<ActionButton onClick={download}>Export layout</ActionButton>
					<ActionButton onClick={() => inputRef.current?.click()}>
						Import layout
					</ActionButton>
					<ActionButton onClick={() => void share()}>
						Copy safe share link
					</ActionButton>
				</div>
			</div>
			<input
				ref={inputRef}
				type="file"
				accept="application/json,.json"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0];
					event.target.value = "";
					if (file) void importFile(file);
				}}
			/>
			<div className="mt-3 flex gap-2">
				<input
					value={sharedLayout}
					onChange={(event) => setSharedLayout(event.target.value)}
					className="min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
					placeholder="Paste a safe share link"
				/>
				<ActionButton
					onClick={() => {
						try {
							onImport(readSharedLayout(sharedLayout));
							onNotice("Imported the shared layout locally.");
						} catch (cause) {
							onError(
								cause instanceof Error
									? cause.message
									: "Could not import share link.",
							);
						}
					}}
				>
					Import link
				</ActionButton>
			</div>
		</section>
	);
}
