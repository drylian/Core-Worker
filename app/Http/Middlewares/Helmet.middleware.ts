import { Middleware } from "../Structures/Middleware";
import helmet from "helmet";
/**
 * Declare the connections acesses
 */
new Middleware({
    name: "HelmetConfigurations",
    run: (async ({ req, res, next }) => {
		helmet({
			contentSecurityPolicy: {
				directives: {
					scriptSrc: ["'self'", () => `'nonce-${req.access.nonce}'`],
				},
			},
			xPoweredBy: false,
			crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
			crossOriginResourcePolicy: { policy: "same-site" },
			strictTransportSecurity: {
				maxAge: 63072000,
				preload: true,
			},
			xFrameOptions: { action: "sameorigin" },
			xPermittedCrossDomainPolicies: {
				permittedPolicies: "none",
			},
		})(req, res, next);
    })
})