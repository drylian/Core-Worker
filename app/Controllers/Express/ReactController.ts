import HtmlIndex from "@/http/pages/system/index.html";
import express, { Application } from "express";
import configuractions from "@/controllers/settings/Default";
import { json } from "@/utils";
import path from "path";
import I18alt from "@/controllers/Language";
import SenderError from "@/http/pages/errors/Error.html";
import HtmlController from "@/http/server/HtmlController";

/**
 * Types do Manifest gerado pelo Vite, apenas os usados
 */
type IndexHtmlEntry = {
	assets: string[];
	css: string[];
	file: string;
	isEntry: boolean;
	src: string;
};

/**
 * Manifest do Vite
 */
type Manifest = {
	"index.html": IndexHtmlEntry;
};

/**
 * Classe que injeta o servidor Vite em uma aplicação Express.
 */
class ViteInjector {
	private server: Application;

	/**
	 * Construtor da classe ViteInjector.
	 * @param {Application} server - A instância do servidor Express.
	 */
	constructor(server: Application) {
		this.server = server;
	}

	/**
	 * Configuração para desenvolvimento com Vite.
	 * @returns {Promise<void>}
	 */
	public async development(): Promise<void> {
		const { createServer } = await import("vite");
		const vite = await createServer({
			server: { middlewareMode: true },
			appType: "custom",
		});
		this.server.use(vite.middlewares);
		this.server.use("*", async (req, res) => {
			const html = new HtmlController(req)
			try {
				vite.transformIndexHtml(
					req.originalUrl,
					await html.automatic(),
				).then((html) => {
					res.status(200).send(html);
				});
			} catch (e) {
				res.status(500).send(html.error({ status: 500, message: new I18alt().t("http:errors.ReactResourcesNotFound") }));
			}
		});
	}

	/**
	 * Configuração para produção com Vite.
	 * @returns {Promise<void>}
	 */
	public async production(): Promise<void> {
		const ViteMinefest: Manifest = json(configuractions.rootPATH + "/http/public/manifest.json");
		const { css, file } = ViteMinefest["index.html"];
		const manifest = [
			`<script type="module" src="/${file}"></script>`,
			...css.map((cssFile: string) => `<link rel="stylesheet" href="/${cssFile}" />`),
		];
		this.server.use("/assets", express.static(path.join(configuractions.rootPATH + "/http/public/assets")));
		this.server.get("*", async (req, res) => {
			const html = new HtmlController(req, manifest)

			if (req.accepts("html")) {
				res.send(await html.automatic());
			}
		});
	}
}

export { ViteInjector };
