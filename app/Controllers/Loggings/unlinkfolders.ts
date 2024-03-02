import fs, { statSync } from "fs";
import path, { join } from "path";
import { Console } from "@/Controllers/Loggings/OnlyConsole";
import { Internal } from "@/Controllers/Storage";
type LogMessage = string | number | boolean | object;
const core = (levelsss: string, ...message: LogMessage[]) => Console("Loggings", "green", levelsss, message);

export function unlinkfolders(logFolderPath: string, level: string, logtype: string) {
	const logFilesPattern = new RegExp(
		`${logtype === "json" ? `.*_${level.toLowerCase()}.json` : `.*_${level.toLowerCase()}.log`}`,
	);
	const logFiles = fs
		.readdirSync(logFolderPath)
		.filter((file) => logFilesPattern.test(file))
		.sort((a, b) => {
			const aStat = statSync(join(logFolderPath, a));
			const bStat = statSync(join(logFolderPath, b));
			return aStat.mtime.getTime() - bStat.mtime.getTime();
		});

	const maxLogFileCount = (Internal.get("loggings:autodelete") as number) ?? 10; // sistema de deletar logs, padrão 10
	const ActiveDelete = (Internal.get("loggings:activedelete") as boolean) ?? true; // ativa o sistema de deletar logs,

	if (ActiveDelete) {
		if (logFiles.length > maxLogFileCount) {
			const filesToDelete = logFiles.slice(0, logFiles.length - maxLogFileCount); // Get the oldest files to delete
			filesToDelete.forEach((file) => {
				const filePath = path.join(logFolderPath, file);
				core("Info", `log antiga deletada : ["${filePath}"].red`);

				fs.unlinkSync(filePath);
			});
		}
	}
}
