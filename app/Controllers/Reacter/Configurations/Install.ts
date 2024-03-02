import { ResourcesPATH, StoragePATH } from "@/Structural";
import path from "node:path";
import * as esbuild from "esbuild";
import { Internal } from "@/Controllers/Storage";
import { ReacterLogger } from "../Plugins/ReacterLogger";
import { ReacterLoaders } from "../Loader";
export function InstallerEsbuild(): esbuild.BuildOptions {
	const production = (Internal.get("core:mode") as string).startsWith("pro") ? true : false;
	return {
		entryPoints: [path.join(ResourcesPATH + "/Install/Index.tsx")],
		bundle: true,
		jsx: "transform",
		format: "esm",
		logLevel: "silent",
		sourcemap: production,
		minify: true,
		outdir: path.join(ResourcesPATH, "Build", "Install"),
		loader: ReacterLoaders,
		plugins: [new ReacterLogger("Install", "blue").init()],
	};
}
