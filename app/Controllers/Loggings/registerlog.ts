import fs from "fs";
import path from "path";
import { unlinkfolders } from "@/Controllers/Loggings/unlinkfolders";
import { dirCR } from "@/Utils";
import { LoggingsPATH } from "@/Structural";
import { getTimestamp } from "@/Controllers/Loggings/getTimestamp";
import { resolve } from "path";
/**
 * Se registerLog for um object
 */
export interface RegisterLog {
    time: string;
    controller: string;
    message: string;
    level?: string;
}
let logData: Record<string, RegisterLog[]> = {};

export function registerlog(level: string, ArchiveLog: string | RegisterLog, Sublevel: string) {
	let logFileName: string;
	const logFolderPath = resolve(LoggingsPATH, level, Sublevel || "");
	let logFilePath: string;
	let logtype: string;
	dirCR(logFolderPath);

	if (typeof ArchiveLog === "object") {
		logtype = "json";
		logFileName = `${getTimestamp().dayTimer}_${level.toLowerCase()}.json`;
		logFilePath = path.join(logFolderPath, logFileName);

		// Verifica se o arquivo já existe e lê seu conteúdo
		if (fs.existsSync(logFilePath)) {
			const existingLogContent = fs.readFileSync(logFilePath, "utf-8");
			logData = JSON.parse(existingLogContent);
		}

		const logEntry: RegisterLog = {
			time: ArchiveLog.time,
			controller: ArchiveLog.controller,
			message: ArchiveLog.message,
			level: ArchiveLog.level || level,
		};
		const logCounter = Object.keys(logData).length + 1;
		logData[`case_${logCounter}`] = [logEntry];

		fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2), { flag: "w" });
		// Verifica e exclui o arquivo mais antigo
		unlinkfolders(logFolderPath, level, logtype);
	} else if (typeof ArchiveLog === "string") {
		logtype = "log";

		logFileName = `${getTimestamp().dayTimer}_${level.toLowerCase()}.log`;
		logFilePath = path.join(logFolderPath, logFileName);

		fs.appendFileSync(logFilePath, ArchiveLog + "\n");

		// Verifica e deleta o arquivo mais antigo
		unlinkfolders(logFolderPath, level, logtype);
	}
}
