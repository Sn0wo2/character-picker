import type {Context} from 'hono';
import {getRandomCharacter} from '../assets/character.ts';
import {minifySVG, parseImageDimensions} from "../utils/img-helper.ts";
import {uint8ArrayToBase64} from "uint8array-extras";

export const characterHandler = async (ctx: Context) => {
    const query = ctx.req.query();

    const character = getRandomCharacter(query.custom?.split(","));
    const gradientStartCY = query.gradientStartCY || '-100%';
    const gradientEndCY = query.gradientEndCY || '50%';
    const colorChangeDuration = parseFloat(query.colorChangeDuration || '2.5') || 2.5;
    const gradientMoveDuration = parseFloat(query.gradientMoveDuration || '4') || 4;
    const gradientCX = query.gradientCX || '50%';
    const gradientR = query.gradientR || '55%';
    const stopColor1 = query.stopColor1 || '#ffffff';
    const stopColor2 = query.stopColor2 || '#ffffff';
    const stopColor3 = query.stopColor3 || '#000000';
    const stopOffset1 = query.stopOffset1 || '0%';
    const stopOffset2 = query.stopOffset2 || '35%';
    const stopOffset3 = query.stopOffset3 || '100%';
    const fromColor = query.fromColor || '#000000';
    const toColor = query.toColor || '#ffffff';
    const begin = query.begin || 'cyMove.end';
    const moveBegin = query.moveBegin || '0s';
    const keySplines1 = query.keySplines1 || '0.25 0.1 0.25 1';
    const keySplines2 = query.keySplines2 || '0.25 0.1 0.25 1';

    const url = new URL(ctx.req.url);
    url.pathname = `/${character}`;
    const request = new Request(url.toString());
    const assetResponse: Response = await ctx.env.ASSETS.fetch(request);
    if (!assetResponse.ok) return ctx.json({msg: "assets not found"}, 404);

    const data = await assetResponse.bytes();

    const dims = parseImageDimensions(data);
    const widthAttr = dims?.width ? `width="${dims.width}"` : `width="auto"`;
    const heightAttr = dims?.height ? `height="${dims.height}"` : `height="auto"`;
    const viewBoxAttr = dims?.width && dims?.height ? `viewBox="0 0 ${dims.width} ${dims.height}"` : "";

    return new Response(minifySVG(`<?xml version="1.0" encoding="utf-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  ${widthAttr}
  ${heightAttr}
  ${viewBoxAttr}
  preserveAspectRatio="xMidYMid meet"
>
  <defs>
    <radialGradient id="g" gradientUnits="userSpaceOnUse" cx="${gradientCX}" cy="${gradientStartCY}" r="${gradientR}">
      <stop offset="${stopOffset1}" stop-color="${stopColor1}" />
      <stop offset="${stopOffset2}" stop-color="${stopColor2}" />
      <stop offset="${stopOffset3}" stop-color="${stopColor3}">
        <animate
          attributeName="stop-color"
          begin="${begin}"
          from="${fromColor}"
          to="${toColor}"
          dur="${colorChangeDuration}s"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="${keySplines1}"
        />
      </stop>
      <animate
        id="cyMove"
        attributeName="cy"
        from="${gradientStartCY}"
        to="${gradientEndCY}"
        begin="${moveBegin}"
        dur="${gradientMoveDuration}s"
        fill="freeze"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="${keySplines2}"
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
    href="data:${assetResponse.headers.get("Content-Type") || "application/octet-stream"};base64,${uint8ArrayToBase64(data)}"
    mask="url(#m)"
  />
</svg>`), {
        status: 200,
        headers: {
            "content-type": "image/svg+xml; charset=utf-8",
            "x-character": character
        },
    });
};