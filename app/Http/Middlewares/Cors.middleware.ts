import { Middleware } from "../Structures/Middleware";
import { SetAllowedRoutes } from "../Functions/AllowedRoutes";
import { Internal } from "@/Controllers/Storage";
import I18alt from "@/Controllers/Languages";
import cors from "cors";
import { Request } from "express";
import { GenericError } from "@/core";
import { Responser } from "../Structures/Responser";

/**
 * Declare the connections acesses
 */
new Middleware({
	name: "HelmetConfigurations",
	run: (async ({ req, res, next }) => {
		const i18n = new I18alt();
		let allowed = []
		if (Internal.get("cors:allowed:routes")) {
			allowed.push(...Internal.get("cors:allowed:routes"));
		}
		if (Internal.get("cors:allowed")) {
			cors<Request>({
				origin(requestOrigin, callback) {
					const origin = requestOrigin
						? requestOrigin
						: req.headers.host
							? SetAllowedRoutes(allowed, Internal.get("core:protocol"), Internal.get("core:port"))
							: undefined;
					const allowedOrigins = SetAllowedRoutes(allowed, Internal.get("core:protocol"), Internal.get("core:port"));

					if (origin && typeof origin === "string" && allowedOrigins.indexOf(origin) !== -1) {
						callback(null, true);
					} else if (Array.isArray(origin)) {
						let found = false; // Variável para rastrear se uma origem válida foi encontrada
						origin.forEach((originItem) => {
							if (typeof originItem === "string" && allowedOrigins.indexOf(originItem) !== -1) {
								callback(null, true);
								found = true; // Uma origem válida foi encontrada
								return;
							}
						});

						if (!found) {
							callback(new Error(i18n.t("system:http.Errors.Cors.description")), false);
						}
					} else {
						callback(new Error(i18n.t("system:http.Errors.Cors.description")), false);
					}
				},
				optionsSuccessStatus: 200,
				credentials: true,
			})(req, res, (err) => {
				if (err) {
					// Se ocorrer um erro, a origem não é permitida
					return res.status(403).send(new Responser(req).error({ status: "Cors", title: "Cors Error", error: err }));
				} else {
					next();
				}
			});
		} else {
			next();
		}
	})
})