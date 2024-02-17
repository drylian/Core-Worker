import { Request, Response } from "express";
import render from "./base/index.html";
import { ColorJson, SettingsJson } from "@/interfaces";
import storage from "@/controllers/Storage";
import ApplicationConfigs from "@/controllers/express/ApplicationConfigs";
import ErrorCss from "./error/error.css";
import JsonCss from "./json/json.css";

import ErrorBody, { ErrorParamsProps } from "./error/error.body";
import { i18t } from "@/controllers/Language";
import JsonBody from "./json/json.body";
import QueryModal from "./json/QueryModal";
import LightJson from "./json/lightjson";
import User, { UserE } from "@/models/User";
import { ALTcpt } from "@/utils";
async function Check(uuid?: string): Promise<UserE | null> {
    if (uuid) {
        const user = await User.findOne({ where: { uuid: uuid } });
        if (user) {
            return user.dataValues
        } else {
            return null
        }
    } else {
        return null
    }
}
class HtmlController {
    private html: string;
    private config: SettingsJson;
    private color: ColorJson;
    private render: { html: string, i18n: i18t };
    private request: Request
    private mode: boolean;
    private manifest: string[] | undefined
    constructor(req: Request, manifest?: string[]) {
        this.config = storage.get("settings")
        this.color = storage.get("color")
        this.request = req
        this.manifest = manifest
        this.render = render(req)
        this.mode = this.config.mode === "pro" || this.config.mode === "production"
        this.html = this.render.html
    }

    public async automatic(res: Response): Promise<string> {
        if (this.mode && !this.manifest) {
            return this.error(this.render.i18n.t("http:errors.ReactResourcesNotFound"));
        }
        if (this.mode && this.manifest && this.manifest.length > 0) {
            return await this.client(res, true, this.manifest);
        }
        if (!this.mode) {
            return await this.client(res, false);
        }
        return this.error(this.render.i18n.t("http:errors.ReactResourcesNotFound"));
    }

    public async client(res: Response, mode: boolean, manifest?: string[]): Promise<string> {
        /**
         * Body Render
         */
        this.html = this.html.replace("<!--Server Responsive-->", `
            <div id="root"></div>
            <script nonce="${this.request.access.nonce}" type="module" src="/Index.tsx"></script>`)

        /**
         * Rederiza o cookie do usuário, para passar ao state do react
         */
        const user = this.request.declares?.cookie ? this.request.declares?.cookie : null
        /**
         * Verifica se o usuário está existe no banco de dados,
         */
        let checked = undefined
        let socketToken = undefined
        if (user && user.uuid) {
            checked = await Check(user.uuid)
            if (checked) {
                socketToken = ALTcpt(checked, this.config.server.socketSignature)
            }
            delete (checked as { uuid?: string }).uuid
            delete (checked as { password?: string }).password
        }
        if (!checked && user) {
            res.clearCookie("X-Application-Access");
            res.clearCookie("X-Application-Refresh");
            res.redirect("/auth/login");
        }
        this.html = this.html.replace("<!--Server Params-->",
            `<!-- Server Response : ${new Date().getTime()}-->
         <script nonce="${this.request.access.nonce}" >
             window.WebsiteConf = ${JSON.stringify(ApplicationConfigs({ socket: socketToken }).Website)};
             ${checked ? `window.UserConf = ${JSON.stringify(checked)}` : ""}
         </script>
         `)

        if (mode && manifest) {
            this.html = this.html.replace("<!--Server Manifest-->", manifest.join("\n"))
        } else {
            this.html = this.html.replace("<!--Server Manifest-->", "<!--Server Development Mode-->")
        }
        return this.html
    }

    public error(options: string | ErrorParamsProps): string {
        this.html = this.html.replace("<!--Server Manifest-->", "")
        this.html = this.html.replace("<!--Server Params-->", `<!-- Server Response : ${new Date().getTime()}--> \n ${ErrorCss(this.color)}`)
        if (typeof options === "string") this.html = this.html.replace("<!--Server Responsive-->", ErrorBody(this.render.i18n, { message: options, status: 500 }))
        else this.html = this.html.replace("<!--Server Responsive-->", ErrorBody(this.render.i18n, { ...options }))
        return this.html

    }

    public json(data: object | object[]): string {
        this.html = this.html.replace("<!--Server Manifest-->", `
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.15/dist/tailwind.min.css" rel="stylesheet">`)
        this.html = this.html.replace("<!--Server Params-->", `<!-- Server Response : ${new Date().getTime()}--> \n ${JsonCss(this.color)}`)
        if (Array.isArray(data)) this.html = this.html.replace("<!--Server Responsive-->", JsonBody(this.config, this.render.i18n, true) + `\n <script nonce="${this.request?.access?.nonce}">${QueryModal(data)} \n ${LightJson()} \n </script>`)
        else this.html = this.html.replace("<!--Server Responsive-->", JsonBody(this.config, this.render.i18n) + `\n <script nonce="${this.request?.access?.nonce}">${LightJson()} \n document.getElementById('codeOutput').innerHTML = syntaxHighlight(JSON.stringify(${JSON.stringify(data, null, 2)}, null, 2));</script>`)
        if (Array.isArray(data)) this.html = this.html.replace("<!--JSON Container-->", '<div id="queryedCode"></div>')
        else this.html = this.html.replace("<!--JSON Container-->", `<pre class="code" id="codeOutput"></pre>`)

        return this.html
    }
}
export default HtmlController