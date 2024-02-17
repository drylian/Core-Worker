import Loggings, { LoggingsColors, LoggingsMethods } from "@/Controllers/Loggings";
import { GenericError } from "@/core";
import { NextFunction, Request, Response } from "express";
import { Responser } from "@/Http/Structures/Responser";
import { genv4 } from "@/Utils";

type ExpressConfigurations = {
    req: Request;
    res: Response;
    next: NextFunction;
}

export type MiddlewareConfigurations = {
    /**
     * Identificador do Middleware, usado em logs
     */
    name: string;
    /**
     * Caso precise expecificar a path onde o middleware vai trabalhar
     */
    path?:string;
    /**
     * Função do Middleware
     * @param express Request,Response,NextFunction do express
     * @param core Console de Logs
     */
    run(express: ExpressConfigurations, core: LoggingsMethods): Promise<void>;
};

export class MiddlewareError extends Error {
    public req: Request;
    public res: Response;
    constructor(req: Request, res: Response, message: string, public statusCode: number) {
        super(message);
        this.name = 'MiddlewareError';
        this.req = req
        this.res = res
    }
}
export interface MiddlewarePush extends  MiddlewareConfigurations {
    start:InstanceType<typeof Middleware>['start']
}

export class Middleware {
    private middleware: MiddlewareConfigurations['run'];
    public static all:MiddlewarePush[] = []
    constructor(options: MiddlewareConfigurations) {
        this.middleware = options.run;
        const data = {
            ...options,
            start:this.start,
        }
        Middleware.all.push(data)
    }

    private start() {
        const middleware = this.middleware;
        const core = new Loggings("Middlewares", "cyan");
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await middleware({ req, res, next }, core);
            } catch (HttpError) {
                if (HttpError instanceof MiddlewareError) {
                    core.error(`[${middleware.name}].blue Erro : ${HttpError.message}`);
                    res.status(500).send(new Responser(req).error({ title: "Middleware Error", status: 500, error: HttpError }));
                } else {
                    core.error(`[${middleware.name}].blue Erro : ${(HttpError as GenericError).message}`);
                    res.status(500).send(new Responser(req).error({ title: "Middleware Error", status: 500, error: HttpError as GenericError }));
                }
            }
        }
    }
}
