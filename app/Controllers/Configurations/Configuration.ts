import { Env, Envsv } from "@/Utils";
import colors from "colors";
import { getTimestamp } from "../Loggings/getTimestamp";

type ArrayType = {
    String: "Astring";
    Boolean: "Aboolean";
    Number: "Anumber";
    Object: "Aobject";
};

type ValueType = string | number | boolean | object | undefined;
type ConfigurationTypeWithValue = ConfigurationType['value'];

export type ConfigurationType = {
    key: string;
    type: "string" | "boolean" | "number" | "object" | ArrayType[keyof ArrayType];
    value: ValueType;
    env?: string;
    checker?: ((env: string, defaults: ConfigurationTypeWithValue) => ConfigurationTypeWithValue) | undefined;
    description: string;
    internal?: boolean;
};

export class Configuration {
    public static readonly SetTypes = {
        String: "string",
        Boolean: "boolean",
        Number: "number",
        Object: "object",
        Array: {
            String: "Astring",
            Boolean: "Aboolean",
            Number: "Anumber",
            Object: "Aobject",
        },
    } as const;

    public static convert(key: ConfigurationType['key'], value: ConfigurationType['value']) {
        const config = Configuration.all.find(c => c.key === key);
        if (config) {           
            switch (config.type) {
                case 'string':
                    return String(value);
                case "number":
                    return Number(value);
                case "boolean":
                    return Boolean(value);
                case "object":
                    return Object(value);
                case "Astring":
                    if (Array.isArray(value)) {
                        return value.map(String);
                    }
                    return String(value);
                case "Aboolean":
                    if (Array.isArray(value)) {
                        return value.map(Boolean);
                    }
                case "Anumber":
                    if (Array.isArray(value)) {
                        return value.map(Number);
                    }
                    return Number(value);
                case "Aobject":
                    if (Array.isArray(value)) {
                        return value.map(Object);
                    }
                    return Object(value);
            }
        }
        return value;
    }

    public static all: Array<ConfigurationType> = []
    /**
     * Atualiza o valores do cache
     * @param config 
     */
    public static update(config: ConfigurationType) {
        const index = Configuration.all.findIndex(c => c.key === config.key);
        if (config?.internal && config?.env) {
            Envsv(config.env, (config.value !== undefined && config.value.toString()))
        }
        if (index !== -1) {
            // Se a configuração existe, substitua-a
            Configuration.all[index] = config;
            console.log(`| ${getTimestamp().currentHour} | ${colors.green("Configurations")} - ${colors.blue(config.key)} | atualizada com sucesso.`)
        } else {
            // Se a configuração não existe, adicione-a
            Configuration.all.push(config);
            console.log(`| ${getTimestamp().currentHour} | ${colors.green("Configurations")} - ${colors.blue(config.key)} | adicionada com sucesso.`)
        }
    }

    constructor(public data: ConfigurationType[]) {
        for (let config of data) {
            if (config?.checker !== undefined && config?.env !== undefined) {
                /**
                 * Personal configurations value
                 */
                const valor = config.value !== undefined ? config.checker(config.env, config.value) : undefined
                config.value = valor ? valor.toString() : undefined;
            } else if (config?.env) {
                /**
                 * Default method of values (Internal)
                 */
                const value = Env(config.env)
                config.value = value ? value : config.value
            }
            console.log(`| ${getTimestamp().currentHour} | ${colors.green("Configurations")} - ${colors.blue(config.key)} | Setado com sucesso.`)
            Configuration.all.push(config)
        }
    }
}