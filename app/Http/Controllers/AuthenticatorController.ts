import Loggings from "@/Controllers/Loggings";
import { Request, Response } from "express";
import I18alt from "@/Controllers/Languages";
import { Permissions } from "@/Models/User.model";

export type AuthorizationOptions = {
    permission?: Permissions;
    only?: Array<"Client" | "Administration" | "Cookie" | "Guest">;
}
export default class AuthenticatorController {
    private permission: AuthorizationOptions["permission"]
    private only: AuthorizationOptions["only"]
    private core: Loggings
    private i18n: InstanceType<typeof I18alt>
    public req: Request
    public res: Response
    constructor(Request: Request, Response: Response, options: AuthorizationOptions) {
        this.core = new Loggings("🛡 Authorization", "red")
        this.permission = options.permission
        this.only = options.only
        this.i18n = new I18alt()
        this.req = Request
        this.res = Response
    }
    public async auth(): Promise<{ req: Request; res: Response }> {
        const { req, res } = this
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            if (req?.declares && req.declares.type) {
                /**
                 * Tratamento para configurar o access para Usuário
                 */
                if (req.declares.type === "Cookie" && req.declares.cookie) {
                    if (!this.only || this.only.includes(req.declares.type)) {
                        const DBUser: UserE | null = await User.findOne({ where: { uuid: req.declares.cookie.uuid } });
                        if (DBUser && DBUser.permissions !== null) {
                            /**
                             * Tratamento para caso a permissão da area seja maior que a permissão do usuario.
                             */
                            if (this.permission && DBUser.permissions < this.permission) {
                                const html = new HtmlController(req)
                                return res.status(401).send(html.error(this.i18n.t("http:messages.NotHaveAccessForRoute", { lang: DBUser.lang || "pt-BR" })));
                            }
                            /**
                             *  Condições aceitas, Prossiga para a rota com acesso.
                             */
                            if (DBUser !== null) {
                                req.access.user = DBUser;
                                req.access.permissions = DBUser.permissions !== null ? DBUser.permissions : 0;
                                req.access.id = DBUser.id
                                req.access.uuid = DBUser.uuid;
                                req.access.lang =
                                    DBUser.lang !== null
                                        ? DBUser.lang
                                        : this.config.server.lang
                                            ? this.config.server.lang
                                            : "pt-BR";
                                resolve({ req, res })
                            } else {
                                const html = new HtmlController(req)
                                return res.status(401).send(html.error(this.i18n.t("http:messages.NotHaveTypeAcessForRoute", { lang: "pt-BR", type: this.i18n.t("attributes.user") })));
                            }
                        }
                    } else {
                        /**
                         * Tipo de Rota inválida para o Tipo de Acesso.
                         */
                        const html = new HtmlController(req)
                        return res.status(401).send(html.error(this.i18n.t("http:messages.NotHaveTypeAcessForRoute", { lang: req.declares.cookie.lang || "pt-BR", type: this.only.join(" or ") })));
                    }
                } else if (req.declares.type === "Administration" && req.declares.token) {
                    /**
                     * Tratamento para configurar o access para um Token Administrativo
                     */
                    if (!this.only || this.only.includes(req.declares.type)) {
                        const BDToken: TokenI | null = await Token.findOne({ where: { token: req.declares.token } });
                        if (BDToken && BDToken.permissions !== null) {
                            /**
                             * Tratamento para caso a permissão da area seja maior que a permissão do token.
                             */
                            if (this.permission && BDToken.permissions < this.permission) {
                                const html = new HtmlController(req)
                                return res.status(401).send(html.error(this.i18n.t("http:messages.NotHaveAccessForRoute", { lang: BDToken.lang || "pt-BR" })));
                            }
                            /**
                             *  Condições aceitas, Prossiga para a rota com acesso.
                             */
                            if (BDToken !== null) {
                                req.access.token = BDToken;
                                req.access.permissions = BDToken.permissions !== null ? BDToken.permissions : 0;
                                req.access.id = BDToken.id
                                req.access.uuid = BDToken.uuid;
                                req.access.lang =
                                    BDToken.lang !== null
                                        ? BDToken.lang
                                        : this.config.server.lang
                                            ? this.config.server.lang
                                            : "pt-BR";
                                resolve({ req, res })
                            } else {
                                const html = new HtmlController(req)
                                return res.status(401).send(html.error(this.i18n.t("http:messages.NotHaveTypeAcessForRoute", { lang: this.config.server.lang || "pt-BR", type: this.i18n.t("attributes.token", { lang: this.config.server.lang || "pt-BR" }) })));
                            }
                        }
                    } else {
                        /**
                         * Tipo de Rota inválida para o Tipo de Acesso.
                         */
                        const html = new HtmlController(req)
                        return res.status(401).send(html.error(this.i18n.t("http:messages.NotHaveTypeAcessForRoute", { lang: this.config.server.lang || "pt-BR", type: this.only.join(" or ") })));
                    }
                } else if (req.declares.type === "Client" && req.declares.token) {
                    /**
                     * Tipo de Rota inválida para o Tipo de Acesso.
                     */
                    const html = new HtmlController(req)
                    return res.status(401).send(html.error(this.i18n.t("http:messages.RouteNotYetTractable", { lang: this.config.server.lang || "pt-BR" })));
                } else if (req.declares.type === "Guest") {
                    if (!this.only || this.only.includes(req.declares.type)) {
                        if (this.permission) {
                            return res.redirect("/auth/login?callback=" + req.originalUrl)
                        } else {
                            resolve({ req, res })
                        }
                    } else {
                        /**
                         * Tipo de Rota inválida para o Tipo de Acesso.
                         */
                        const html = new HtmlController(req)
                        return res.status(401).send(html.error(this.i18n.t("http:messages.NotHaveTypeAcessForRoute", { lang: this.config.server.lang || "pt-BR", type: this.only.join(" or ") })));
                    }
                }
            } else {
                /**
                 * Tratamento para Requests Inválidas (Security 2)
                 */
                switch (req.accepts(["html", "json", "txt"])) {
                    case "html":
                        this.core.warn("Acesso Bloqueado pelo Authorization, Acesso Sem Declaração, ip: ", `${req.access?.ip}`)
                        const html = new HtmlController(req)
                        return res.status(401).send(html.error("Blocked Access in Authorization Defender"))
                    case "json":
                        return res.status(401).json({
                            type: "error",
                            status: res.statusCode || req.statusCode,
                            timestamp: Date.now(),
                            message: 'Blocked Access in Authorization Defender.',
                        });
                    case "txt":
                        return res.status(401).type("txt").send('Invalid Request, Blocked Access in Authorization Defender.')
                    default:
                        return res.status(401).type("txt").send('Invalid Request, Blocked Access in Authorization Defender.')
                }
            }
        })
    }

}