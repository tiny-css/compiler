import { NODE_ENV } from "../../config";

export function isProduction():boolean {
    return NODE_ENV==="production"
}