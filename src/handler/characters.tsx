import {Context} from "hono";
import {IMAGES} from "../character";

export const charactersHandler = (ctx: Context) => {
    return ctx.json(IMAGES)
}