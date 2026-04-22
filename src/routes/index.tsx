import GameCarousel from "#/components/portfolio/GameCarousel";
import ModProjectCards from "#/components/portfolio/ModProjectCards";
import SupportBar from "#/components/portfolio/SupportBar";
import { currentGamePitch } from "#/data/portfolio";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<>
			<SupportBar />
			<main className="page-wrap px-4 pb-12 pt-6">
				<section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
					<div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.35),transparent_68%)]" />
					<div className="pointer-events-none absolute -bottom-24 -right-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.2),transparent_70%)]" />
					<p className="island-kicker mb-3">David Zetterdahl · LordDz</p>
					<h1 className="display-title mb-4 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
						Game developer & modder
					</h1>
					<p className="mb-6 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
						I build RTS campaigns, Source episodes, and jam games—usually with a
						focus on co-op, scripting, and tools.
					</p>
					<div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 sm:p-6">
						<p className="island-kicker mb-2">Currently in the works</p>
						<h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
							{currentGamePitch.title}
						</h2>
						<p className="mt-2 mb-0 text-sm text-[var(--sea-ink-soft)]">
							{currentGamePitch.body}
						</p>
					</div>
				</section>

				<div className="mt-10 space-y-10">
					<GameCarousel />
					<ModProjectCards />
				</div>
			</main>
		</>
	);
}
