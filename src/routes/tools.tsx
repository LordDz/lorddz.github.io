import GohEntityRenameTool from "#/components/portfolio/GohEntityRenameTool";
import GohMiMergeTool from "#/components/portfolio/GohMiMergeTool";
import { portfolioGames } from "#/data/portfolio";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools")({
	component: ToolsRoute,
});

function ToolsRoute() {
	const gohGame = portfolioGames.find((game) => game.id === "goh");

	return (
		<main className="page-wrap px-4 pb-12 pt-6">
			<section className="island-shell rise-in rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
				<p className="island-kicker mb-3">Utilities</p>
				<h1 className="display-title mb-4 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
					Modding tools
				</h1>
				<p className="mb-0 max-w-3xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
					Small browser-side tools for workflow-heavy modding tasks.
				</p>
			</section>

			<section className="mt-10">
				<h2 className="mb-2 text-2xl font-semibold text-[var(--sea-ink)]">
					{gohGame?.title ?? "Gates of Hell"}
				</h2>
				<p className="mb-5 text-sm text-[var(--sea-ink-soft)]">
					All tools process data in-browser and keep your files local.
				</p>
				<div className="space-y-5">
					<GohEntityRenameTool />
					<GohMiMergeTool />
				</div>
			</section>
		</main>
	);
}
