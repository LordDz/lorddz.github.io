import { Link } from "@tanstack/react-router";

const cards: Array<{
	label: string;
	detail: string;
	href?: "/stack";
}> = [
	{ label: "Start + Router", detail: "File routes, SSR-ready shell" },
	{ label: "Query + Table + Form", detail: "Data, grids, inputs" },
	{ label: "Store + Hotkeys", detail: "Carousel state + keys" },
	{
		label: "Intent + CLI",
		detail: "Skills + scaffold command",
		href: "/stack",
	},
];

export default function TanStackStrip() {
	return (
		<section className="mt-10 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-5 sm:px-6">
			<p className="island-kicker mb-3">TanStack stack in this repo</p>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{cards.map((item) =>
					item.href ? (
						<Link
							key={item.label}
							to={item.href}
							className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4 text-sm text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(79,184,178,0.45)]"
						>
							<div className="font-semibold">{item.label}</div>
							<div className="mt-1 text-xs text-[var(--sea-ink-soft)]">
								{item.detail} →
							</div>
						</Link>
					) : (
						<div
							key={item.label}
							className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4 text-sm text-[var(--sea-ink)]"
						>
							<div className="font-semibold">{item.label}</div>
							<div className="mt-1 text-xs text-[var(--sea-ink-soft)]">
								{item.detail}
							</div>
						</div>
					),
				)}
			</div>
		</section>
	);
}
