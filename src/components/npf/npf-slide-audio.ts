import { npfContentSlides } from "#/data/npf-slides";

/** Slide indices that play presentation audio (splash music, ticking clock, …). */
export function npfSlideHasAudio(slideIndex: number): boolean {
	if (slideIndex === 0) {
		return true;
	}
	const slide = npfContentSlides[slideIndex - 1];
	return slide?.id === "negativt";
}
