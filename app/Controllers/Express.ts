import { StructuralRouters, StructuralMiddlewares } from "@/Http/Structures/StructuralExpress";
import { RootPATH, StoragePATH, StructuralLanguageWatcher } from "@/Structural";
import { dirCR, dirEX, gen } from "@/Utils";
import express from "express";
import Loggings from "./Loggings";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import compression from "compression";
import { Internal } from "./Storage";
import path from "path";
import { ViteInjector } from "./Vite";

export class Express {
	public express: express.Application;
	public async start(app: express.Application) {
		if ((Internal.get("core:mode") as string).startsWith("pro")) {
			await new ViteInjector(app).production();
		} else {
			await new ViteInjector(app).development();
		}
	}
	constructor() {
		const apache = new Loggings("Apache-Logs");
		this.express = express();
		this.express.use(async (req, res, next) => {
			/**
			 * Geral Structure
			 */
			const start = Date.now();
			res.locals.ping = start;
			const nonce = gen(32);
			req.access = {};
			req.core = {};
			req.core.nonce = nonce;
			req.core.ping = start;

			if (!dirEX(StoragePATH)) {
				/**
				 * Case delete StorageDir
				 */
				dirCR(StoragePATH);
			}
			if (!dirEX(StoragePATH + "/Compilated.langs.json")) {
				/**
				 * Case delete CompilatedLangs
				 */
				await StructuralLanguageWatcher();
			}
			next();
		});
		this.express.disable("x-powered-by");
		this.express.use((req, res, next) => {
			morgan("combined", {
				stream: {
					write: (message: string) => {
						apache.txt(message);
					},
				},
			})(req, res, next);
		});
		this.express.use(compression());
		this.express.use(express.json());
		this.express.use(fileUpload());
		this.express.use(express.urlencoded({ extended: true }));
		this.express.use(cookieParser(Internal.get("core:signature") as string));
		this.express.use("/icon", express.static("./node_modules/boxicons/"));
		this.express.use(express.static(path.join(RootPATH + "/Http/Assets")));
	}
}
