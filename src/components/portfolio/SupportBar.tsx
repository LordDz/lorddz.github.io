import { supportLinks } from "./supportLinks";

export default function SupportBar() {
	return (
		<div className="page-wrap px-4 pt-4">
			<div className="flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 shadow-[0_12px_40px_rgba(30,90,72,0.08)]">
				<span className="mr-auto text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
					Support the work
				</span>
				{supportLinks.map((link) => (
					<a
						key={link.href}
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						className={`rounded-full border px-4 py-2 text-sm font-semibold no-underline transition hover:-translate-y-0.5 ${link.className}`}
					>
						{link.label}
					</a>
				))}
			</div>
		</div>
	);
}
