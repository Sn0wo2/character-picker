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
<svg
  xmlns="http://www.w3.org/2000/svg"
  ${widthAttr}
  ${heightAttr}
  ${viewBoxAttr}
  preserveAspectRatio="xMidYMid meet"
>

  <defs>
    <radialGradient id="g" gradientUnits="userSpaceOnUse" cx="50%" cy="-100%" r="150%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#000000">
        <animate
          attributeName="stop-color"
          begin="cyMove.end"
          from="#000000"
          to="#ffffff"
          dur="1s"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.25 0.1 0.25 1"
        />
      </stop>

      <animate
        id="cyMove"
        attributeName="cy"
        from="-100%"
        to="50%"
        begin="0s"
        dur="2.5s"
        fill="freeze"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.25 0.1 0.25 1"
      />
    </radialGradient>

    <mask id="m">
      <rect width="100%" height="100%" fill="url(#g)" />
    </mask>
  </defs>

  <image
    x="0" y="0"
    ${dims?.width ? `width="${dims.width}"` : ""}
    ${dims?.height ? `height="${dims.height}"` : ""}
    href="data:${assetResponse.headers.get("Content-Type") || "application/octet-stream"};base64,${arrayBufferToBase64(buffer)}"
    mask="url(#m)"
  />

</svg>`, {
        status: 200,
        headers: {
            "content-type": "image/svg+xml; charset=utf-8",
            "x-character": character
        },
    });
};

