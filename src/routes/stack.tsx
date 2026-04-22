import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/stack")({
	head: () => ({
		meta: [{ title: "TanStack stack · LordDz" }],
	}),
	component: StackPage,
});

function StackPage() {
	return (
		<main className="page-wrap px-4 pb-16 pt-10">
			<p className="island-kicker mb-2">Reference</p>
			<h1 className="display-title mb-4 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
				Libraries demonstrated in this repo
			</h1>
			<p className="max-w-2xl text-sm text-[var(--sea-ink-soft)] sm:text-base">
				TanStack CLI bootstrapped the project; TanStack Intent ships skills
				under{" "}
				<code className="rounded bg-[var(--sand)] px-1.5 py-0.5 text-xs">
					node_modules
				</code>{" "}
				for Router and Start. The home page exercises Store, Hotkeys, Query,
				Table, and Form in user-facing UI.
			</p>

			<section className="island-shell mt-8 rounded-2xl p-6">
				<h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
					Exact scaffold command
				</h2>
				<pre className="mt-3 overflow-x-auto rounded-xl bg-[var(--foam)] p-4 text-xs text-[var(--sea-ink)] sm:text-sm">
					npx @tanstack/cli@latest create my-tanstack-app --agent
					--package-manager npm --toolchain biome --add-ons
					tanstack-query,table,form
				</pre>
				<p className="mt-3 mb-0 text-sm text-[var(--sea-ink-soft)]">
					Output was merged from <code>my-tanstack-app/</code> into this
					workspace root. Add-ons were kept; Store and Hotkeys were added with{" "}
					<code className="text-xs">
						npm install @tanstack/react-store @tanstack/react-hotkeys
					</code>
					.
				</p>
			</section>

			<ul className="mt-8 space-y-3 text-sm text-[var(--sea-ink)]">
				{[
					[
						"TanStack Start",
						"Vite plugin, SSR/prerender pipeline, shell routes",
					],
					[
						"TanStack Router",
						"File routes in src/routes, Link, loaders-ready tree",
					],
					[
						"TanStack Query",
						"Mock preset fetch in the Gates of Hell economy scratchpad card",
					],
					["TanStack Table", "Derived economy rows next to the form"],
					["TanStack Form", "Controlled numeric inputs with Zod validation"],
					["TanStack Store", "Selected game index for the carousel"],
					["TanStack Hotkeys", "Arrow keys to change games"],
					["TanStack Intent", "Agent skill paths — see AGENTS.md mappings"],
					["TanStack CLI", "Documented command above; rerun for upgrades"],
				].map(([name, detail]) => (
					<li
						key={name}
						className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
					>
						<span className="font-semibold">{name}</span>
						<span className="text-[var(--sea-ink-soft)]"> — {detail}</span>
					</li>
				))}
			</ul>

			<Link
				to="/"
				className="mt-10 inline-flex rounded-full border border-[rgba(50,143,151,0.35)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:bg-[rgba(79,184,178,0.24)]"
			>
				← Back to portfolio
			</Link>
		</main>
	);
}
