# Project context (LordDz portfolio)

## TanStack CLI (exact command)

```bash
npx @tanstack/cli@latest create my-tanstack-app --agent --package-manager npm --toolchain biome --add-ons tanstack-query,table,form
```

The CLI created `my-tanstack-app/`; contents were moved to this repository root so the workspace is the app (no nested folder).

## TanStack Intent

Commands run from the project root:

```bash
npx @tanstack/intent@latest install
npx @tanstack/intent@latest list
```

`install` prints setup guidance (skill-to-task mappings). `list` reports 29 skills across intent-enabled packages (Router, Start, Devtools, etc.). Before large Router or Start changes, load the relevant skill from `node_modules/.../skills/.../SKILL.md` paths shown by `list`.

<!-- intent-skills:start -->

# Skill mappings — when working in these areas, load the linked skill file into context.

skills:

  - task: "TanStack Start app shell, Vite plugin, prerender, deployment"
    load: "node_modules/@tanstack/start-client-core/skills/start-core/SKILL.md"

  - task: "GitHub Pages, static prerender, SPA base path, hosting"
    load: "node_modules/@tanstack/start-client-core/skills/start-core/deployment/SKILL.md"

  - task: "TanStack Router file routes, route tree, navigation, Link"
    load: "node_modules/@tanstack/router-core/skills/router-core/SKILL.md"

  - task: "TanStack Router bundler plugin and route generation"
    load: "node_modules/@tanstack/router-plugin/skills/router-plugin/SKILL.md"

  - task: "React Start bindings (createStart, server functions, RSC)"
    load: "node_modules/@tanstack/react-start/skills/react-start/SKILL.md"

<!-- intent-skills:end -->

## Stack and integrations

| Piece | Role |
| --- | --- |
| Package manager | npm |
| Toolchain | Biome (`npm run check`, `lint`, `format`) |
| Framework | TanStack Start (React 19, Vite 8) |
| Routing | TanStack Router (file routes under `src/routes`) |
| Data | TanStack Query (see demos + home tools panel) |
| Tables / forms | TanStack Table, TanStack Form (demos + home tools) |
| Client state | TanStack Store (`src/stores/gameCarouselStore.ts`) |
| Keyboard | TanStack Hotkeys (`HotkeysProvider` in `__root.tsx`, carousel) |
| Styling | Tailwind CSS v4 |

Added after scaffold: `@tanstack/react-store`, `@tanstack/react-hotkeys`.

**TanStack CLI** is not a runtime dependency; it is documented here and on the `/stack` route.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_BASE_PATH` | Vite `base` for asset URLs. Use `/` for apex `username.github.io` or `https://localhost:3000`. For a project site such as `https://lorddz.github.io/website/`, set `VITE_BASE_PATH=/website/` before `npm run build`. |

## Deployment (GitHub Pages)

1. Enable GitHub Pages (Actions or branch) for the repository.
2. Build with the correct base path, for example:  
   `VITE_BASE_PATH=/website/ npm run build`  
   if the site is served from `https://<user>.github.io/website/`.
3. Publish the **`dist/client`** directory (prerendered HTML + assets). TanStack Start’s Node server output under `dist/server` is not used on static hosting.
4. Prerender is enabled in `vite.config.ts` (`tanstackStart({ prerender: { enabled: true, crawlLinks: true } })`) so routes work without a server.
5. Workflow: see `.github/workflows/deploy-pages.yml` (optional; set repository variable `VITE_BASE_PATH` if not deploying to site root).

## Architecture notes

- **Carousel selection** lives in `gameCarouselStore` (TanStack Store) so any future panel can subscribe without prop drilling.
- **Arrow keys** use `useHotkeys` inside the carousel; `HotkeysProvider` wraps the app in `__root.tsx`.
- **Portfolio content** is data-driven in `src/data/portfolio.ts` (games, projects, images, optional YouTube URLs).
- **Router basepath** follows `import.meta.env.BASE_URL` in `src/router.tsx` so client routes match Vite `base` on subpaths.

## Known gotchas

- **Discord link**: `Footer.tsx` still points at a placeholder; replace with a real invite URL.
- **YouTube search URLs**: some entries use search URLs until you paste canonical video links.
- **External images**: `picsum.photos` is convenient for layout; swap for your own screenshots before launch.
- **Biome**: `npm run check` targets `./src` and `./vite.config.ts` so generated or build output is not linted. Demo routes keep stricter rules relaxed via `biome.json` overrides.
- **TanStack Hotkeys** is alpha; verify shortcuts do not conflict with browser or assistive tech.

## Planned next steps

- Replace placeholder support/social URLs with live links and real thumbnails.
- Add real interactive tools (e.g. build calculators) backed by `createServerFn` if you need persistence.
- Tune prerender `pages` / `filter` if you add many dynamic routes.
