import {Context} from "hono";
import {getRandomCharacter} from "../character";

export const characterHandler = async (ctx: Context) => {
    const url = new URL(ctx.req.url);
    url.pathname = `/${getRandomCharacter()}`;

    const assetResponse = await ctx.env.ASSETS.fetch(
        new Request(url.toString(), ctx.req.raw)
    );

    if (!assetResponse.ok) {
        return new Response("Asset not found", {status: 404});
    }

    return assetResponse;
};
