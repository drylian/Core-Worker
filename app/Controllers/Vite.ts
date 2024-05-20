import express, { Application } from "express";
import { json } from "@/Utils";
import path from "path";
import I18alt from "@/Controllers/Languages";
import { ResourcesPATH } from "@/Structural";
import { HTMLBase } from "@/Resources/Structural.html";
import ViteConf from "./Vite/Vite.config";
import { Internal } from "./Storage";
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
			...ViteConf(!Internal.get("core:installed") as boolean || Internal.get("core:installed") as boolean),
			server: {
				middlewareMode: true,
				open: "/",
			},
			appType: "custom",
		});
		this.server.use(vite.middlewares);
		this.server.use("*", async (req, res) => {
			const html = HTMLBase(req, true)
			try {
				vite.transformIndexHtml(
					req.originalUrl,
					html,
				).then((html) => {
					res.status(200).send(html);
				});
			} catch (e) {
				res.status(500).send(new I18alt().t("http:errors.ReactResourcesNotFound"));
			}
		});
	}

	/**
	 * Configuração para produção com Vite.
	 * @returns {Promise<void>}
	 */
	public async production(): Promise<void> {
		const ViteMinefest: Manifest = json(ResourcesPATH + "/Builded/manifest.json");
		const { css, file } = ViteMinefest["index.html"];
		const manifest = [
			`<script type="module" src="/${file}"></script>`,
			...css.map((cssFile: string) => `<link rel="stylesheet" href="/${cssFile}" />`),
		];
		this.server.use("/assets", express.static(path.join(ResourcesPATH + "/Builded/assets")));
		this.server.get("*", async (req, res) => {
			const html = HTMLBase(req, false, manifest)

			if (req.accepts("html")) {
				res.send(html);
			}
		});
	}
}

export { ViteInjector };
