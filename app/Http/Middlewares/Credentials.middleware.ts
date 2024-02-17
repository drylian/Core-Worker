import { gen } from "@/Utils";
import { Middleware } from "../Structures/Middleware";
import helmet from "helmet";
import { Internal } from "@/Controllers/Storage";
import { SetAllowedRoutes } from "../Functions/AllowedRoutes";
/**
 * Declare the connections acesses
 */
new Middleware({
	name: "CredentialsConfigurations",
	run: (async ({ req, res, next }) => {
		const nonce = gen(32);
		req.access = {};
		req.access.nonce = nonce;
		let allowed = []
		if (Internal.get("cors:allowed:routes")) {
			allowed.push(...Internal.get("cors:allowed:routes"));
		}
		const origin = req.headers.origin
			? req.headers.origin
			: req.headers.host
				? SetAllowedRoutes(req.headers.host, Internal.get("core:protocol"), Internal.get("core:port"))
				: undefined;
		const allowedOrigins = SetAllowedRoutes(
			allowed,Internal.get("core:protocol"), Internal.get("core:port")
		);

		if (origin && typeof origin === "string" && allowedOrigins.includes(origin)) {
			res.header("Access-Control-Allow-Credentials", "true");
		} else if (Array.isArray(origin)) {
			origin.forEach((originItem) => {
				if (typeof originItem === "string" && allowedOrigins.includes(originItem)) {
					res.header("Access-Control-Allow-Credentials", "true");
				}
			});
		}
		next();
	})
})