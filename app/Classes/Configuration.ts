import { Env, Envsv } from "@/Utils";
import { Console, LoggingsMessage } from "@/Controllers/Loggings";

type GenericValue = string | number | object | boolean;
type GenericConfigurationType = "string" | true | 1 | {}
type ConfigurationDefaults = {
    key: string;
    value: GenericValue;
    type: GenericConfigurationType | GenericConfigurationType[];
    env?: string;
    description: string;
    internal?: boolean;
    checker?: ((env: string, defaults: GenericValue) => GenericValue | undefined);
};

function Core(type: string, ...args: LoggingsMessage[]) {
    return Console(type, "magenta", ...args);
}

export class Configuration<T extends ConfigurationDefaults[]> {
    public static SetTypes = {
        String: "string",
        Boolean: true,
        Number: 1,
        Object: {},
    };
    public readonly data;
    public static convert(key: ConfigurationDefaults['key'], value: GenericValue): GenericValue {
        const config = Configuration.all.find((c) => c.key === key);
        if (config) {
            const arg = Configuration.SetTypes;
            if (Array.isArray(config.type)) {
                return Array(config.value);
            }

            if (config.type === arg.String) return String(value);
            if (config.type === arg.Number) return Number(value);
            if (config.type === arg.Boolean) return Boolean(value);
            if (config.type === arg.Object) return Object(value);
        }
        return value;
    }

    public static all: ConfigurationDefaults[] = [];

    constructor(data: T extends Required<ConfigurationDefaults[]> ? T : ConfigurationDefaults[]) {
        this.data = data
        for (const config of data) {
            if (config?.checker !== undefined && config?.env !== undefined) {
                const valor = config.value !== undefined ? config.checker(config.env, config.value) : undefined;
                config.value = valor ? valor.toString() : "";
            } else if (config?.env) {
                const value = Env(config.env);
                config.value = value ? value : config.value;
            }
            if (config.env) {
                Core("Env", `[${config.env}].green-b -> [${config.key}].blue-b`);
            } else {
                Core("DB", `Defaults -> [${config.key}].blue-b`);
            }
            Configuration.all.push(config);
        }
    }

    public static update(config: ConfigurationDefaults): void {
        const index = Configuration.all.findIndex((c) => c.key === config.key);
        if (config?.internal && config?.env) {
            Envsv(config.env, config.value !== undefined && config.value.toString());
        }
        if (index !== -1) {
            Configuration.all[index] = config;
            Core("Env", `[${config.key}].blue-b atualizada com sucesso`);
        } else {
            Configuration.all.push(config);
            Core("Env", `[${config.key}].blue-b adicionada com sucesso`);
        }
    }
}
