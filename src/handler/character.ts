import type {Context} from 'hono';
import {getRandomCharacter} from '../character';
import {arrayBufferToBase64, parseImageDimensions} from "../utils/img-helper.ts";

export const characterHandler = async (ctx: Context): Promise<Response> => {
    const url = new URL(ctx.req.url);
    const character = getRandomCharacter(ctx.req.query().custom?.split(","))
    url.pathname = `/${character}`;

    const assetResponse = await ctx.env.ASSETS.fetch(new Request(url.toString(), ctx.req.raw));
    if (!assetResponse.ok) return ctx.json({msg: "assets not found"}, 404);

    const buffer = await assetResponse.arrayBuffer();

    const dims = parseImageDimensions(buffer);
    const widthAttr = dims?.width ? `width="${dims.width}"` : `width="auto"`;
    const heightAttr = dims?.height ? `height="${dims.height}"` : `height="auto"`;
    const viewBoxAttr = dims?.width && dims?.height ? `viewBox="0 0 ${dims.width} ${dims.height}"` : "";

    return new Response(`<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${widthAttr} ${heightAttr} ${viewBoxAttr} preserveAspectRatio="xMidYMid meet">
    <style><![CDATA[
    @keyframes slideInScaleFade {
        from {
            opacity: 0;
            transform: translateX(30px) scale(0.92);
        }
        to {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }

    .img {
        opacity: 0;
        animation: slideInScaleFade 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: 50ms;
        transform-origin: center center;
        will-change: opacity, transform;
    }
    ]]></style>
    <image class="img" x="0" y="0" ${dims?.width ? `width="${dims.width}"` : ""} ${dims?.height ? `height="${dims.height}"` : ""} href="data:${assetResponse.headers.get("Content-Type") || "application/octet-stream"};base64,${arrayBufferToBase64(buffer)}" preserveAspectRatio="xMidYMid meet" />
</svg>`, {
        status: 200,
        headers: {
            "content-type": "image/svg+xml; charset=utf-8",
            "x-character": character
        },
    });
};

