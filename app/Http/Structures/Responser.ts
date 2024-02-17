import I18alt from "@/Controllers/Languages";
import { Internal } from "@/Controllers/Storage";
import { GenericError } from "@/core";
import { Request, Response } from "express";
import { Html_Base } from "./Base/Index.html";
import { ErrorHtml } from "../Views/Error.html";
import { JsonHtml } from "../Views/Json.html";
export type ResponserErrorTypes = {
    error: GenericError;
    title: string;
    status: 400 | 401 | 404 | 500 | 403 | "Cors"
}
export type ResponserJsonTypes = {
    data: object | object[];
    title: string;
}
export function render(string: string) {
    return string;
}

export class Responser {
    public request: Request;
    public response: Response;

    private html: string
    private i18n: InstanceType<typeof I18alt>;
    constructor(req: Request, res: Response) {
        this.request = req;
        this.response = res;
        this.i18n = new I18alt(this.request.access?.lang ?? Internal.get("core:language"));;
        this.html = "";
    }
    /**
     * I18n arg , for translation 
     * @param message 
     */
    public error(options: ResponserErrorTypes) {
        const message = this.i18n.t(options.error.message ?? "unknown")
        switch (this.request.accepts(["html", "json", "txt"])) {
            case "html":
                this.html = Html_Base({
                    title: options.title,
                    language: this.i18n.lang,
                    description: this.i18n.t("system:http.Errors." + options.status + ".description"),
                    keywords: this.i18n.t("system:http.Errors." + options.status + ".keywords"),
                })

                this.html = this.html.replace("<!--Server Manifest-->", "")
                this.html = this.html.replace("<!--Server Params-->", `<!-- Server Response : ${new Date().getTime()}-->`)
                if ((Internal.get("core:mode") as string).startsWith("pro")) {
                    this.html = this.html.replace("<!--Server Responsive-->", ErrorHtml(message))
                } else {
                    this.html = this.html.replace("<!--Server Responsive-->", ErrorHtml(message))
                }
                return this.response.send(this.html)
            case "json":
                if ((Internal.get("core:mode") as string).startsWith("pro")) {
                    return this.response.json({
                        type: "error",
                        status: this.response.statusCode || this.response.statusCode,
                        timestamps: {
                            end: Date.now(),
                            start: this.response.locals.ping,
                            delay: Date.now() - this.response.locals.ping + "ms",
                        },
                        message: options.error.message,
                    });
                } else {
                    return this.response.json({
                        type: "error",
                        status: this.response.statusCode || this.response.statusCode,
                        timestamps: {
                            response: Date.now(),
                            request: this.response.locals.ping,
                            end: Date.now() - this.response.locals.ping + "ms",
                        },
                        message: options.error.message,
                        error: options.error,
                    });
                }
            case "txt":
                if ((Internal.get("core:mode") as string).startsWith("pro")) {
                    return this.response.type("txt").send(options.error.message)
                } else {
                    return this.response.type("txt").send(options.error)
                }
            default:
                if ((Internal.get("core:mode") as string).startsWith("pro")) {
                    return this.response.type("txt").send(options.error.message)
                } else {
                    return this.response.type("txt").send(options.error)
                }
        }
    }
    public json(options: ResponserJsonTypes) {
        switch (this.request.accepts(["html", "json", "txt"])) {
            case "html":
                this.html = Html_Base({
                    title: this.i18n.t("routes:names." + this.request.core.route?.name ?? "undefined"),
                    language: this.i18n.lang,
                    description: this.i18n.t("system:http.Json.description"),
                    keywords: this.i18n.t("system:http.Json.keywords"),
                })
                this.html = this.html.replace("<!--Server Manifest-->", `
                <link rel="stylesheet" href="/css/tailwind.css">
                <link rel="stylesheet" href="/icon/css/boxicons.min.css">
                <script src="https://unpkg.com/@themesberg/flowbite@latest/dist/flowbite.bundle.js"></script>
                <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js'></script>
                <link rel="stylesheet" href="/css/loading.css">
                `)
                this.html = this.html.replace("<!--Server Params-->", `<!-- Server Response : ${new Date().getTime()}-->`)
                this.html = this.html.replace("<!--Server Responsive-->", JsonHtml(options.data,this.request))
                return this.response.send(this.html)
            case "json":
                return this.response.json({
                    type: "success",
                    status: this.response.statusCode || this.response.statusCode,
                    timestamps: {
                        end: Date.now(),
                        start: this.response.locals.ping,
                        delay: Date.now() - this.response.locals.ping + "ms",
                    },
                    data: options.data,
                });
            case "txt":
                return this.response.type("txt").send("Invalid Request")
            default:
                return this.response.type("txt").send("Invalid Request")
        }
    }
}