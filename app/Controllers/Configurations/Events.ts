import { EventEmitter } from "node:events";
import colors from "colors";
import { LogMessage } from "../Loggings";
import { Console } from "../Loggings/OnlyConsole";

function Core(type: string, ...args: LogMessage[]) {
	return Console("Eventos", "cyan", type, args);
}

// Mapeia os nomes dos eventos para as assinaturas de suas funções `run`
export type EventsList = {
    InstallationComplete: () => void;
    DatabaseUpdateSet: (key: string, value: object | number | string) => void;
    UpdateInternalSet: (key: string, value: object | number | string) => void;
};

// Define um tipo que representa todas as possíveis configurações de eventos
export type AllEventConfigurations = {
    [K in keyof EventsList]: { name: K; run: EventsList[K] };
};

export class Events {
	public static all: Array<AllEventConfigurations[keyof EventsList]> = [];
	public static set = new EventEmitter();

	constructor(public data: AllEventConfigurations[keyof EventsList]) {
		Core("Event", `${colors.blue(data.name)} Configurado.`);
		Events.all.push(data);
	}
}
