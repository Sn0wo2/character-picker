/* eslint-disable  @typescript-eslint/no-explicit-any */
import type {Context} from 'hono';
import {getRandomCharacter} from '../character';

export const characterHandler = async (ctx: Context): Promise<Response> => {
    const url = new URL(ctx.req.url);
    url.pathname = `/${getRandomCharacter(ctx.req.query().custom?.split(","))}`;

    const assetResponse = await ctx.env.ASSETS.fetch(
        new Request(url.toString(), ctx.req.raw)
    );

    if (!assetResponse.ok) {
        return ctx.json({msg: "assets not found"}, 404);
    }

    const contentType = assetResponse.headers.get("Content-Type") || "image/png";
    const buffer = await assetResponse.arrayBuffer();

    function arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000;
        let binary = '';
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
    }

    const b64 = arrayBufferToBase64(buffer);
    const dataUrl = `data:${contentType};base64,${b64}`;

    const svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="auto" height="auto">
  <style><![CDATA[
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px) scale(0.998); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .img {
      opacity: 0;
      animation: fadeIn 700ms ease-out forwards;
      animation-delay: 50ms;
      transform-origin: center center;
      will-change: opacity, transform;
    }
  ]]></style>
  <image class="img" x="0" y="0" href="${dataUrl}" />
</svg>`;

    return new Response(svg, {
        status: 200,
        headers: {
            "content-type": "image/svg+xml; charset=utf-8",
        },
    });
};
