import { useHotkeys } from "@tanstack/react-hotkeys";
import { useSelector } from "@tanstack/react-store";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { portfolioGames } from "#/data/portfolio";
import {
	carouselNext,
	carouselPrev,
	gameCarouselStore,
} from "#/stores/gameCarouselStore";

export default function GameCarousel() {
	const gameIndex = useSelector(gameCarouselStore, (state) => state.gameIndex);

	useHotkeys(
		[
			{
				hotkey: "ArrowLeft",
				callback: () => carouselPrev(),
				options: { preventDefault: true },
			},
			{
				hotkey: "ArrowRight",
				callback: () => carouselNext(),
				options: { preventDefault: true },
			},
		],
		{ enabled: portfolioGames.length > 0 },
	);

	const active = portfolioGames[gameIndex];

	return (
		<section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-5 py-8 sm:px-8 sm:py-10">
			<div
				className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90 ${active?.accent ?? "from-[#173a40] to-[#328f97]"}`}
			/>
			<div className="relative">
				<p className="island-kicker mb-2 text-white/90">Modding focus</p>
				<div className="mb-6 flex flex-wrap items-end justify-between gap-4">
					<div>
						<h2 className="m-0 text-3xl font-bold tracking-tight text-white sm:text-4xl">
							{active?.title ?? "Games"}
						</h2>
						<p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
							{active?.tagline}
						</p>
						<p className="mt-1 text-xs text-white/70">
							Engine: {active?.engine}
						</p>
					</div>
					<p className="text-xs text-white/75">
						Tip: use{" "}
						<kbd className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[11px]">
							←
						</kbd>{" "}
						<kbd className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[11px]">
							→
						</kbd>{" "}
						(TanStack Hotkeys)
					</p>
				</div>

				<div className="flex flex-wrap gap-2">
					{portfolioGames.map((game, index) => {
						const selected = index === gameIndex;
						return (
							<button
								key={game.id}
								type="button"
								onClick={() =>
									gameCarouselStore.setState(() => ({ gameIndex: index }))
								}
								className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
									selected
										? "border-white bg-white text-black shadow-lg"
										: "border-white/35 bg-white/10 text-white hover:bg-white/20"
								}`}
							>
								{game.title}
							</button>
						);
					})}
				</div>

				<div className="mt-6 flex justify-end gap-2">
					<button
						type="button"
						onClick={() => carouselPrev()}
						className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
						aria-label="Previous game"
					>
						<ChevronLeft size={18} />
						Prev
					</button>
					<button
						type="button"
						onClick={() => carouselNext()}
						className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
						aria-label="Next game"
					>
						Next
						<ChevronRight size={18} />
					</button>
				</div>
			</div>
		</section>
	);
}
