import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/games/")({
	component: GamesHub,
	head: () => ({
		meta: [{ title: "Games · LordDz" }],
	}),
});

function GamesHub() {
	return (
		<main className="page-wrap px-4 pb-12 pt-6">
			<section className="island-shell rise-in rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
				<p className="island-kicker mb-3">Play</p>
				<h1 className="display-title mb-4 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
					Games
				</h1>
				<p className="mb-0 max-w-3xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
					Browser games built for fun — no install required.
				</p>
			</section>

			<section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				<Link
					to="/games/awesome-word"
					className="group island-shell rise-in block overflow-hidden rounded-[1.5rem] no-underline transition hover:shadow-lg"
				>
					<div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-strong)]">
						<div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#538d4e_0%,#3a3a3c_50%,#b59f3b_100%)]">
							<span className="text-5xl font-bold tracking-widest text-white/90">
								AW
							</span>
						</div>
					</div>
					<div className="px-5 py-4">
						<h2 className="m-0 text-xl font-bold text-[var(--sea-ink)] group-hover:text-[var(--lagoon)]">
							AwesomeWord
						</h2>
						<p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">
							Guess the word in six tries — Ordle-style with categories.
						</p>
					</div>
				</Link>
			</section>
		</main>
	);
}
