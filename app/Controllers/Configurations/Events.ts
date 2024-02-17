import { EventEmitter } from "events";
import colors from "colors";
import { getTimestamp } from "../Loggings/getTimestamp";

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
        console.log(`| ${getTimestamp().currentHour} | ${colors.green("Eventos")} - ${colors.blue(data.name)} | Setado com sucesso.`);
        Events.all.push(data);
    }
}
