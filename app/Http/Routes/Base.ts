/**
 * Global Routes, used in all server
 */
import { Responser } from "@/Http/Structures/Responser";
import { Router } from "@/Http/Structures/Route";

new Router({
    name: "BaseRequest",
    type: [Router.Types.FullAccess],
    path: "/",
    method: Router.Methods.Get,
    run: async ({ req, res }) => {
        new Responser(req, res).json({
            title: "Ping Request",
            data: [{ ping: Date.now() - res.locals.ping }, { ping: Date.now() - res.locals.ping, }]
        })
    }
})