import Loggings, { LoggingsColors } from "@/Controllers/Loggings";
import { ResourcesPATH } from "@/Structural";
import { Uptimer } from "@/Utils/Uptimer";
import * as esbuild from "esbuild";
import path from "path";
import colors from "colors";
export class ReacterLogger {
	private core: InstanceType<typeof Loggings>;
	constructor(title: string, color: LoggingsColors) {
		this.core = new Loggings(title, color, {
			format: `[${colors.cyan("Compiling")}] [{{time}}].gray {{title}}{{message}}`,
		});
	}
	init(): esbuild.Plugin {
		const core = this.core;
		return {
			name: "reacter-logger",
			setup(build) {
				const startTime = process.uptime();
				build.onStart(() => {
					core.log(
						`Compilando:[${path.basename(build.initialOptions.outdir ? build.initialOptions.outdir : "idk")}].magenta-b`,
					);
				});
				build.onLoad({ filter: /\.?$/ }, async (args) => {
					const elapsedTime = Uptimer(process.uptime() - startTime, true);
					core.log(
						`[${elapsedTime}].red [${path.relative(path.join(process.cwd(), ResourcesPATH), args.path)}].magenta`,
					);
					return null;
				});
				build.onEnd((result) => {
					if (result.warnings.length) {
						for (const warning of result.warnings) {
							core.warn(warning.text);
						}
						core.warn(`Compilação [concluída].green com [${result.warnings.length} avisos].yellow.`);
					}
					const elapsedTime = Uptimer(process.uptime() - startTime, true); // Calcular o tempo decorrido
					if (result.errors.length) {
						for (const error of result.errors) {
							core.error(error.text);
						}
						core.warn(
							`Compilação [concluída].green com [${result.errors.length} errors].yellow em [${elapsedTime}].red.`,
						);
					} else {
						core.log(`Compilação [concluída].green em [${elapsedTime}].red.`);
					}
				});
			},
		};
	}
}
