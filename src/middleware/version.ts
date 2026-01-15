import type {Context, Next} from "hono";
import {getVersion} from "../assets/version.ts";

export const versionMiddleware = async (ctx: Context, next: Next) => {
    const {hash, url} = await getVersion()

    ctx.res.headers.set('x-version', hash);
    ctx.res.headers.set('x-project', url);

    await next();
}
