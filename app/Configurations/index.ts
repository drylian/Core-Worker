export type InternalSettings = {
    "core:installed": boolean;
    "core:key": string;
    "core:language": string;
    "core:owner": string;
    "core:logo": string;
    "core:mode": "development" | "production";
    "core:port": number;
    "core:protocol": "http" | "https" | "http/https";
    "core:signature": string;
    "core:title": string;
    "core:url": string;
    "database:dialect": "mysql" | "sqlite";
    "database:host": string;
    "database:port": number;
    "database:user": string;
    "database:pass": string;
    "database:database": string;
    "loggings:level": "Debug" | "Info" | "Warn" | "Error";
    "loggings:limit": number;
    "loggings:delete": boolean;
    "cors:allowed": boolean;
    "cors:allowed:routes": string[];
    "namespace:user": string;
    "namespace:tokens": string;
    "cache:languages": object;
}
export type InternalKeys = keyof InternalSettings