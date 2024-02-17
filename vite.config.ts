import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "pathe";
import { fileURLToPath } from "node:url";
// https://vitejs.dev/config/
export default defineConfig({
	root: "./resources",
	base: "/",
	optimizeDeps: {
		esbuildOptions: {
			target: "es2020",
		},
	},
	esbuild: {
		// https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
		logOverride: { "this-is-undefined-in-esm": "silent" },
	},
	plugins: [
		react({
			babel: {
				plugins: ["babel-plugin-macros", "babel-plugin-styled-components"],
			},
		}),
	],
	server: {
		open: "/",
	},
	build: {
		outDir: "../app/http/public",
		manifest: true,
	},
	resolve: {
		alias: {
			"@": resolve(dirname(fileURLToPath(import.meta.url)), "resources"),
		},
	},
},
);
