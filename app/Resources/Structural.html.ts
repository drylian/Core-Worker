import { Internal } from "@/Controllers/Storage";
import { Request } from "express";
/**
 * Base Structural html 
 */
export function HTMLBase(Request: Request, Development: boolean, Manifest?: string[]) {
    return `
    <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" type="image/png" href="${Internal.get("core:logo")} />
                <title></title>
                <!-- Server Params-->
                <script>
                    window.WebsiteConf = ${JSON.stringify({})};
                    ${/*user ? `window.UserConf = ${JSON.stringify({})}` : ""*/""}
                    </script>
                ${Development ? "<!-- Modo Desenvolvedor -->" : "<!-- Modo Produção --> \n" + Manifest?.join("\n")}
            </head>
            <body>
                <div id="root"></div>
                <script src="/Index.tsx"></script>
            </body>
        </html>
    `
}