import { getTimestamp } from "@/Controllers/Loggings/getTimestamp";
import { loggings } from "@/Controllers/Loggings/Params";
import colors from "colors";
import { RegisterLog, registerlog } from "@/Controllers/Loggings/registerlog";
import { Colors, ConsoleLog as ConsoleLogger, LogType } from "@/Controllers/Loggings/Types";
import { CheckColors } from "@/Controllers/Loggings/Checker";
import { LoggingsOptions } from "@/Controllers/Loggings";
import { StringColors, WhiteColors, WhiteLogs } from "@/Controllers/Loggings/Colors";
import { Internal } from "@/Controllers/Storage";

const cores: Colors = colors;
type LogMessage = string | number | boolean | object;

export function logs(controller: string, level: string, color: string, options: LoggingsOptions, args: LogMessage[]) {
	/**
     * Make Logs
     * @param ConsoleLog
     */
	function MakeLog(ConsoleLog: ConsoleLogger) {
		const { currentHour, color, controller, levelColor, level, message } = ConsoleLog;
		const formattedController = cores[color](controller);
		const formattedLevel = cores[levelColor](level);
		const formattedMessage = message; // Aplicar cores à mensagem
		let Formatteds = StringColors(options?.format as string);
		if (Formatteds?.includes("{{time}}")) {
			Formatteds = Formatteds.replace("{{time}}", currentHour);
		}
		if (Formatteds?.includes("{{title}}")) {
			Formatteds = Formatteds.replace("{{title}}", formattedController);
		}
		if (Formatteds?.includes("{{status}}")) {
			Formatteds = Formatteds.replace("{{status}}", formattedLevel);
		}
		if (Formatteds?.includes("{{message}}")) {
			Formatteds = Formatteds.replace("{{message}}", formattedMessage);
		}
		console.log(Formatteds);
	}
	const argumentss = args;
	const message = WhiteColors(argumentss);
	// const message = msg + args.join(); // converte os args em uma string separando por " "
	let ArchiveLog: string | RegisterLog = "";

	const CURRENT_LOG_LEVEL = (Internal.get("loggings:level") as string) || "Debug"; // Altere o nível atual conforme necessário
	// carrega o codigo
	const levelConfig: LogType = loggings[level];
	const currentLevelConfig = loggings[CURRENT_LOG_LEVEL];

	const ColorController = CheckColors(color, controller);
	const SelectedColor = !levelConfig.color ? "white" : CheckColors(levelConfig?.color, level);
	if (level === "OnlyLog") {
		const { fulltimer, timestamp } = getTimestamp();
		const formattedMessage = WhiteLogs(argumentss); // remove o parametro de cores
		if (options.register?.type === "log") {
			ArchiveLog = `[ ${
				options.register?.timer === "timestamp" ? timestamp : fulltimer
			} ] [ ${controller} ] ${formattedMessage}`;
		} else if (options.register?.type === "json") {
			ArchiveLog = {
				time: options.register?.timer === "timestamp" ? timestamp.toString() : fulltimer,
				controller,
				message: formattedMessage,
			};
		} else {
			ArchiveLog = `[ ${
				options.register?.timer === "timestamp" ? timestamp : fulltimer
			} ] [ ${controller} ] ${formattedMessage}`;
		}
		return registerlog(controller, ArchiveLog, "Register");
	}

	if (level === "OnlyConsole") {
		const { currentHour } = getTimestamp();
		const ConsoleLog: ConsoleLogger = {
			currentHour,
			color: ColorController,
			controller,
			levelColor: SelectedColor,
			level: "Console",
			message,
		};
		return MakeLog(ConsoleLog);
	}

	if (levelConfig.level <= currentLevelConfig.level) {
		const { currentHour, fulltimer, timestamp } = getTimestamp();
		const ConsoleLog: ConsoleLogger = {
			currentHour,
			color: ColorController,
			controller,
			levelColor: SelectedColor,
			level,
			message,
		};
		MakeLog(ConsoleLog);
		const formattedMessage = WhiteLogs(argumentss); // remove o parametro de cores
		if (options.register?.type === "log") {
			ArchiveLog = `[ ${
				options.register?.timer === "timestamp" ? timestamp : fulltimer
			} ] [ ${controller} ] ${formattedMessage}`;
		} else if (options.register?.type === "json") {
			ArchiveLog = {
				time: options.register?.timer === "timestamp" ? timestamp.toString() : fulltimer,
				controller,
				level,
				message: formattedMessage,
			};
		} else {
			ArchiveLog = `[ ${
				options.register?.timer === "timestamp" ? timestamp : fulltimer
			} ] [ _.${controller}._ ] ${formattedMessage}`;
		}
		registerlog(controller, ArchiveLog, level);
	}
}
