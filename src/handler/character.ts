/* eslint-disable  @typescript-eslint/no-explicit-any */
import type {Context} from 'hono';
import {getRandomCharacter} from '../character';

export const characterHandler = async (ctx: Context): Promise<any> => {
    const url = new URL(ctx.req.url);
    url.pathname = `/${getRandomCharacter(ctx.req.query().custom?.split(','))}`;

    const assetResponse = await ctx.env.ASSETS.fetch(
        new Request(url.toString(), ctx.req.raw)
    );

    if (!assetResponse.ok) {
        return ctx.json({msg: 'assets not found'}, 404);
    }

    const contentType = assetResponse.headers.get('Content-Type') || 'image/png';
    const buffer = await assetResponse.arrayBuffer();

    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000; // 32kb chunks to avoid apply() arg limits
        let binary = '';
        for (let i = 0; i < bytes.length; i += chunkSize) {
            const sub = bytes.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, Array.from(sub));
        }
        return btoa(binary);
    };

    const b64 = arrayBufferToBase64(buffer);
    const dataUrl = `data:${contentType};base64,${b64}`;

    const svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
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

  <image class="img"
         x="0" y="0" width="100%" height="100%"
         href="${dataUrl}"
         preserveAspectRatio="xMidYMid meet" />
</svg>`;

    return new Response(svg, {
        status: 200,
        headers: {
            'content-type': 'image/svg+xml; charset=utf-8',
        },
    });
};
