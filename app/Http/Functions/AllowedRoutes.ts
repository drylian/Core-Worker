import _ from 'lodash';

/**
 * SetAllowedRoutes
 * @param allowed String das rotas permitidas, separadas por vírgula
 * @param protocol protocolo usado (http, https, http/https)
 * @param port número da porta
 * @returns array de rotas permitidas
 */
export function SetAllowedRoutes(allowed: string | string[], protocol: string, port: string): string[] {
	let routes: string[] = [];

	// Verifica se 'allowed' é uma string antes de tentar dividir
	if (typeof allowed === "string") {
		routes = allowed.split(",").map((route) => route.trim());
	} else if (Array.isArray(allowed)) {
		routes = allowed;
	}

	const allowedOrigins: string[] = [];
	const protocols: string[] = [];

	// Adiciona protocolos com base na entrada
	switch (protocol) {
		case "http":
			protocols.push("http");
			break;
		case "https":
			protocols.push("https");
			break;
		case "http/https":
			protocols.push("http", "https");
			break;
		default:
			break;
	}

	// Gera origens permitidas com base nas rotas, protocolos e porta
	routes.forEach((route) => {
		protocols.forEach((protocol) => {
			let originWithPort, originWithoutPort
			if (!route.startsWith(protocol)) {
				originWithPort = `${protocol}://${route}:${port}`;
				originWithoutPort = `${protocol}://${route}`;
			}else {
				originWithPort = `${route}:${port}`;
				originWithoutPort = `${route}`;
			}

			if (port && !allowedOrigins.includes(originWithPort) && !route.endsWith(port)) allowedOrigins.push(originWithPort);
			if (!allowedOrigins.includes(originWithoutPort)) allowedOrigins.push(originWithoutPort);
		});
	});
	return _.union(allowedOrigins);
}
