# LordDz Portfolio Website

A modern personal portfolio site for game modding and mapping work, built with TanStack Start.

This project highlights shipped and in-progress work across titles like Gates of Hell, StarCraft II, Black Mesa, Age of Empires II, and more. Content is data-driven and rendered through a fast React + TanStack stack with static prerender support for GitHub Pages.

## What this project is

- Personal portfolio and showcase hub for projects, mods, maps, and videos
- Built as a single-page style app with file-based routing
- Designed to deploy as static assets (GitHub Pages friendly)
- Structured so portfolio entries are easy to update from one data file

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19 + Vite)
- [TanStack Router](https://tanstack.com/router) (file routes under `src/routes`)
- [TanStack Query](https://tanstack.com/query), Table, Form, Store, and Hotkeys
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Biome](https://biomejs.dev/) for linting and formatting

## Quick start

```bash
npm install
npm run dev
```

Local app usually runs on `http://localhost:3000`.

## Scripts

```bash
npm run dev      # start local dev server
npm run build    # production build (client + server output)
npm run test     # run vitest tests
npm run lint     # biome lint
npm run format   # biome format
npm run check    # biome check (lint + formatting checks)
```

## Project structure

- `src/routes` - app pages (`/`, `/about`, `/stack`, demo routes)
- `src/data/portfolio.ts` - core portfolio/game/project content
- `src/components/portfolio` - portfolio UI blocks and tools
- `public/portfolio` - static image assets used by entries
- `vite.config.ts` - TanStack Start + prerender configuration

## Deployment (GitHub Pages)

Static output lives in `dist/client` after `npm run build` (not `dist/server`). Prerender is enabled in `vite.config.ts`.

### `LordDz/lorddz.github.io` (root site — primary)

Live URL: `https://lorddz.github.io/`

1. **Settings → Pages → Build and deployment → Source:** **GitHub Actions** (not “Deploy from a branch”). Branch deploy only serves committed source files, not the built app.
2. **Settings → Actions → General:** allow workflows for this repository.
3. Optional **Settings → Secrets and variables → Actions → Variables:** `VITE_BASE_PATH` = `/` (the workflow defaults to `/` if unset).
4. Every push to `master` runs [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml): `npm ci` → `npm run build` → deploy `dist/client` via `actions/deploy-pages`.

Do **not** add `deploy-user-site-root.yml` to this repo; that workflow is only for a separate source repository (see below).

### `LordDz/website` (project site at `/website/`)

If you maintain a **second** repository for `https://lorddz.github.io/website/`:

1. Set repository variable `VITE_BASE_PATH` = `/website/`.
2. Use the same `deploy-pages.yml` with **Pages source: GitHub Actions**.
3. To also mirror builds to the root user site, add `.github/workflows/deploy-user-site-root.yml` **only on `LordDz/website`**, with:
   - Secret `USER_SITE_DEPLOY_TOKEN` (contents write on `LordDz/lorddz.github.io`)
   - Variable `USER_SITE_BRANCH` = `master` (if the user site uses `master`, not `main`)

### Manual deploy

```bash
VITE_BASE_PATH=/ npm run build   # root user site
# or
VITE_BASE_PATH=/website/ npm run build   # project site
```

Upload or publish the contents of `dist/client`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_BASE_PATH` | Vite base path for asset URLs and router base path (`/` for root site, `/website/` for project site). |

## Content updates

Most portfolio content lives in `src/data/portfolio.ts`:

- Add/edit games and projects
- Update links (YouTube, Steam Workshop, Steam store)
- Swap thumbnails and card images

If you want to personalize the site further, start with:

- `src/components/Header.tsx`
- `src/components/portfolio/SupportBar.tsx`
- `src/routes/about.tsx`

## Notes

- Some links and placeholder media may still need final production replacements.
- Demo routes under `src/routes/demo` can be removed once no longer needed.
