import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rawBase = process.env.VITE_BASE_PATH ?? "/";
const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

const config = defineConfig({
	base,
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: true,
				concurrency: 8,
				failOnError: true,
			},
		}),
		viteReact(),
	],
});

export default config;
