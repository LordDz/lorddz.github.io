import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";

import { awesomeWordCategories } from "#/data/awesome-word/categories";
import { awesomeWordStore } from "#/stores/awesomeWordStore";

export const Route = createFileRoute("/gallery/")({
	component: GalleryHub,
	head: () => ({
		meta: [{ title: "Gallery · LordDz" }],
	}),
});

function GalleryHub() {
	const { screenshots } = useStore(awesomeWordStore);

	return (
		<main className="page-wrap px-4 pb-12 pt-6">
			<section className="island-shell rise-in rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
				<p className="island-kicker mb-3">AwesomeWord</p>
				<h1 className="display-title mb-4 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
					Gallery
				</h1>
				<p className="mb-0 max-w-3xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
					Saved round screenshots from your AwesomeWord games, grouped by
					category.
				</p>
			</section>

			<section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{awesomeWordCategories.map((category) => {
					const count = screenshots.filter(
						(shot) => shot.categoryId === category.id,
					).length;

					return (
						<Link
							key={category.id}
							to="/gallery/$categoryId"
							params={{ categoryId: category.id }}
							className="group island-shell rise-in block overflow-hidden rounded-[1.5rem] no-underline transition hover:shadow-lg"
						>
							<div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-strong)]">
								<img
									src={category.imageUrl}
									alt=""
									className="h-full w-full object-cover"
								/>
							</div>
							<div className="px-5 py-4">
								<h2 className="m-0 text-xl font-bold text-[var(--sea-ink)] group-hover:text-[var(--lagoon)]">
									{category.name}
								</h2>
								<p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">
									{category.description}
								</p>
								<p className="mt-2 mb-0 text-xs font-semibold tracking-wide text-[var(--sea-ink-soft)] uppercase">
									{count === 0
										? "No rounds saved yet"
										: `${count} round${count === 1 ? "" : "s"} saved`}
								</p>
							</div>
						</Link>
					);
				})}
			</section>
		</main>
	);
}
