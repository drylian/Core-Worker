import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "pathe";
import { ResourcesPATH } from "@/Structural";
import path from "path";
// https://vitejs.dev/config/
export default function ViteConf (installer:boolean) {
    return defineConfig({
        root: path.resolve(installer ? ResourcesPATH + "/Installer" : ResourcesPATH + "/Client"),
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
        build: {
            outDir: installer ? ResourcesPATH + "/Build/Installer" : ResourcesPATH + "/Build/Client",
            manifest: true,
        },
        resolve: {
            alias: {
                "@re": resolve(installer ? ResourcesPATH + "/Installer" : ResourcesPATH + "/Client"),
            },
        },
    },
    );
}