type Props = {
	open: boolean;
	text: string;
	onClose: () => void;
};

export default function NpfSpeakerNotes({ open, text, onClose }: Props) {
	if (!open || !text) {
		return null;
	}

	return (
		<div
			className="fixed inset-x-0 bottom-0 z-[200] border-t border-white/10 bg-black/85 px-6 py-5 text-white shadow-[0_-12px_40px_rgba(0,0,0,0.4)] backdrop-blur-md sm:px-10"
			role="dialog"
			aria-label="Talaranteckningar"
		>
			<div className="mx-auto flex max-w-4xl items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-300/90">
						Talaranteckningar: PÅ
					</p>
					<p className="m-0 whitespace-pre-line text-sm leading-relaxed text-white/92 sm:text-base">
						{text}
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="flex-shrink-0 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
				>
					Växla av (B)
				</button>
			</div>
		</div>
	);
}
