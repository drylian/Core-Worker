import path from "path";
import { json } from "@/Utils/Json";

/**
 * Basic Args
 */
export let Type = path.join(__filename).endsWith(".ts") ? "Typescript" : "Javascript";
export let Version = json<{ version: "string" }>("./package.json").version ? json<{ version: "string" }>("./package.json").version : "Canary";
/***
 * Paths for Panel
 */
export let RootPATH = path.join(__filename).endsWith(".ts") ? "./app" : "./src";
export let StoragePATH = RootPATH + "/Storage";
export let LoggingsPATH = RootPATH + "/Storage/Logs";
export let LangsPATH = RootPATH + "/Languages";

