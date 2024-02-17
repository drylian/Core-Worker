import { AuthenticateTypes, Router } from "./Http/Structures/Route";

/**
 * Core Aplication Declares
 */
declare global {
    namespace Core_ATS {
        interface SettingsAttributes {
            key: string;
            type: "number" | "string" | "boolean" | "object" | "string[]" | "number[]" | "object[]";
            value: string;
            description: string;
        }
        interface GenericError {
            message?: string;
            stack?: string;
            code?: string | number;
        }
    }
    namespace Express {
        interface Request {
            access: {
                /**
                 * Core Arguments storage
                 */
            };
            /**
             * Core Request Arguments
             */
            core:{
                ping?:number;
                /**
                 * Requested Route info
                 */
                route?:{
                    /**
                     * i18n arg or string;
                     */
                    name:string;
                    path:string;
                    /**
                     * i18n arg or string;
                     */
                    comment:string;
                }
                /**
                 * Type Request, is User,Token or User token etc...
                 */
                type?: AuthenticateTypes;
                /**
                 * Nonce of request, for helmet
                 */
                nonce?:string;
            }
        }
    }
}

export = Core_ATS;
