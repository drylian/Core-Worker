import { ResourcesPATH, StoragePATH } from "@/Structural";
import path from "node:path";
import * as esbuild from "esbuild";
import { Internal } from "@/Controllers/Storage";
import { ReacterLogger } from "../Plugins/ReacterLogger";
import { ReacterLoaders } from "../Loader";

export function ClientEsbuild(): esbuild.BuildOptions {
	const production = (Internal.get("core:mode") as string).startsWith("pro") ? true : false;
	return {
		entryPoints: [path.join(ResourcesPATH + "/Client/Index.tsx")],
		bundle: true,
		jsx: "transform",
		format: "esm",
		logLevel: "silent",
		packages: "external",
		platform: "neutral",
		sourcemap: production,
		minify: true,
		outdir: path.join(ResourcesPATH, "Build", "Client"),
		loader: ReacterLoaders,
		plugins: [new ReacterLogger("Client", "blue").init()],
	};
}
