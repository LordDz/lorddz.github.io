import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import ScreenshotGallery from "#/components/games/awesome-word/ScreenshotGallery";
import {
	awesomeWordCategories,
	getCategoryById,
} from "#/data/awesome-word/categories";
import type { CategoryId } from "#/data/awesome-word/types";

const categoryIds = new Set<CategoryId>(
	awesomeWordCategories.map((category) => category.id),
);

function isCategoryId(value: string): value is CategoryId {
	return categoryIds.has(value as CategoryId);
}

export const Route = createFileRoute("/gallery/$categoryId")({
	beforeLoad: ({ params }) => {
		if (!isCategoryId(params.categoryId)) {
			throw notFound();
		}
	},
	component: GalleryCategoryRoute,
	head: ({ params }) => {
		const category = isCategoryId(params.categoryId)
			? getCategoryById(params.categoryId)
			: null;

		return {
			meta: [
				{
					title: category
						? `${category.name} Gallery · LordDz`
						: "Gallery · LordDz",
				},
			],
		};
	},
});

function GalleryCategoryRoute() {
	const { categoryId } = Route.useParams();
	const category = getCategoryById(categoryId);

	return (
		<main className="page-wrap px-4 pb-12 pt-6">
			<section className="island-shell rise-in rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
				<p className="island-kicker mb-3">AwesomeWord</p>
				<h1 className="display-title mb-4 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
					{category.name} gallery
				</h1>
				<p className="mb-4 max-w-3xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
					{category.description}
				</p>
				<Link
					to="/gallery"
					className="text-sm font-semibold text-[var(--lagoon)] no-underline hover:underline"
				>
					← All galleries
				</Link>
			</section>

			<ScreenshotGallery categoryId={categoryId} variant="page" />
		</main>
	);
}
