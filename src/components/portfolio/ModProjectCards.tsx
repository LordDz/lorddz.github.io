import { useSelector } from "@tanstack/react-store";
import { ExternalLink, Play } from "lucide-react";

import CoopEconomyScratchpad from "#/components/portfolio/CoopEconomyScratchpad";
import GohMiMergeTool from "#/components/portfolio/GohMiMergeTool";
import { portfolioGames } from "#/data/portfolio";
import { gameCarouselStore } from "#/stores/gameCarouselStore";

export default function ModProjectCards() {
	const gameIndex = useSelector(gameCarouselStore, (state) => state.gameIndex);
	const game = portfolioGames[gameIndex];

	if (!game) return null;

	return (
		<section className="mt-8">
			<h3 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
				Projects for {game.title}
			</h3>
			<div className="grid gap-5 md:grid-cols-2">
				{game.projects.map((project) => {
					const hasOutbound =
						Boolean(project.youtubeUrl) ||
						Boolean(project.steamWorkshopUrl) ||
						Boolean(project.steamStoreUrl);
					const showLinkHint = !hasOutbound && !project.embed;

					return (
						<article
							key={project.id}
							className="island-shell rise-in flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--line)]"
						>
							<div className="relative aspect-video w-full overflow-hidden bg-[var(--sand)]">
								<img
									src={project.image}
									alt=""
									className="h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
							<div className="flex flex-1 flex-col p-5">
								<h4 className="m-0 text-base font-semibold text-[var(--sea-ink)]">
									{project.title}
								</h4>
								<p className="mt-2 flex-1 text-sm text-[var(--sea-ink-soft)]">
									{project.summary}
								</p>
								{project.embed === "coop-economy" ? (
									<CoopEconomyScratchpad />
								) : null}
								{project.embed === "goh-mi-merge" ? (
									<GohMiMergeTool embedded />
								) : null}
								{hasOutbound || showLinkHint ? (
									<div className="mt-4 flex flex-wrap gap-2">
										{project.youtubeUrl ? (
											<a
												href={project.youtubeUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(79,184,178,0.18)] px-3 py-1.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:bg-[rgba(79,184,178,0.28)]"
											>
												<Play size={16} aria-hidden />
												YouTube
											</a>
										) : null}
										{project.steamWorkshopUrl ? (
											<a
												href={project.steamWorkshopUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(47,106,74,0.15)] px-3 py-1.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:bg-[rgba(47,106,74,0.25)]"
											>
												<ExternalLink size={16} aria-hidden />
												Steam Workshop
											</a>
										) : null}
										{project.steamStoreUrl ? (
											<a
												href={project.steamStoreUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(26,58,74,0.14)] px-3 py-1.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:bg-[rgba(26,58,74,0.24)]"
											>
												<ExternalLink size={16} aria-hidden />
												Steam
											</a>
										) : null}
										{showLinkHint ? (
											<span className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--line)] px-3 py-1.5 text-xs text-[var(--sea-ink-soft)]">
												<ExternalLink size={14} aria-hidden />
												Add <code className="text-[11px]">youtubeUrl</code>,{" "}
												<code className="text-[11px]">steamWorkshopUrl</code>,
												or <code className="text-[11px]">steamStoreUrl</code> in{" "}
												<code className="text-[11px]">
													src/data/portfolio.ts
												</code>
											</span>
										) : null}
									</div>
								) : null}
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
}
