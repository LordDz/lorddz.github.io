import { Store } from "@tanstack/store";

import { portfolioGames } from "#/data/portfolio";

type CarouselState = {
	gameIndex: number;
};

export const gameCarouselStore = new Store<CarouselState>({ gameIndex: 0 });

function gameCount() {
	return portfolioGames.length;
}

export function setCarouselGameIndex(next: number) {
	const len = gameCount();
	if (len === 0) return;
	const clamped = ((next % len) + len) % len;
	gameCarouselStore.setState(() => ({ gameIndex: clamped }));
}

export function carouselNext() {
	setCarouselGameIndex(gameCarouselStore.state.gameIndex + 1);
}

export function carouselPrev() {
	setCarouselGameIndex(gameCarouselStore.state.gameIndex - 1);
}
