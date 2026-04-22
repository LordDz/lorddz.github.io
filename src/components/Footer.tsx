export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
			<div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
				<p className="m-0 text-sm">&copy; {year} David Zetterdahl (LordDz)</p>
				<p className="island-kicker m-0">Gothenburg · Sweden</p>
			</div>
			<div className="mt-6 flex flex-wrap justify-center gap-3">
				<a
					href="https://www.youtube.com/@davidawesome4569"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:bg-[var(--link-bg-hover)]"
				>
					YouTube
				</a>
				<a
					href="https://discord.gg/ZU4dXdz"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:bg-[var(--link-bg-hover)]"
				>
					Discord
				</a>
			</div>
		</footer>
	);
}
