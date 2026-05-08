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

This site is configured for static hosting.

1. Set base path for your repository site:
   - Example for `https://lorddz.github.io/website/`:
   - `VITE_BASE_PATH=/website/`
2. Build:
   - `npm run build`
3. Deploy `dist/client` to Pages (not `dist/server`)

You can also automate deployment with `.github/workflows/deploy-pages.yml`.

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
