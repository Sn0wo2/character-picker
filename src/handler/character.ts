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

    const dataUrl = `data:${contentType};base64,${btoa(
        String.fromCharCode(...new Uint8Array(buffer))
    )}`;

    const {width, height} = await getImageDimensions(buffer, contentType);

    const svg = generateSVG(dataUrl, width, height);

    return new Response(svg, {
        status: 200,
        headers: {
            "content-type": "image/svg+xml; charset=utf-8",
        },
    });
};

async function getImageDimensions(buffer: ArrayBuffer, contentType: string): Promise<{
    width: number;
    height: number
}> {
    if (contentType === "image/png") {
        return getPngDimensions(buffer);
    } else if (contentType === "image/jpeg") {
        return getJpegDimensions(buffer);
    } else if (contentType === "image/gif") {
        return getGifDimensions(buffer);
    } else {
        throw new Error(`Unsupported content type: ${contentType}`);
    }
}

function getPngDimensions(buffer: ArrayBuffer): { width: number; height: number } {
    const dv = new DataView(buffer);
    const width = dv.getUint32(16);
    const height = dv.getUint32(20);
    return {width, height};
}

function getJpegDimensions(buffer: ArrayBuffer): { width: number; height: number } {
    const dv = new DataView(buffer);
    let offset = 2;

    while (offset < buffer.byteLength) {
        const marker = dv.getUint16(offset);
        offset += 2;

        if (marker === 0xFFC0 || marker === 0xFFC2) {
            const height = dv.getUint16(offset + 1);
            const width = dv.getUint16(offset + 3);
            return {width, height};
        }

        offset += dv.getUint16(offset);
    }

    throw new Error("Unable to parse JPEG dimensions");
}

function getGifDimensions(buffer: ArrayBuffer): { width: number; height: number } {
    const dv = new DataView(buffer);
    const width = dv.getUint16(6, true);
    const height = dv.getUint16(8, true);
    return {width, height};
}

function generateSVG(dataUrl: string, width: number, height: number): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" height="${height}">
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
  <image class="img" x="0" y="0" width="${width}" height="${height}" href="${dataUrl}" />
</svg>`;
}
