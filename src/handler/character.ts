import type { Context } from "hono"
import { html } from "hono/html"
import { imageSize } from "image-size"
import { uint8ArrayToBase64 } from "uint8array-extras"
import { CHARACTER_NAMES, IMAGE_GEOMETRY, IMAGES } from "../assets/character.ts"
import type { AppEnv } from "../global.d.ts"

export const characterHandler = async (ctx: Context<AppEnv>) => {
  const {
    custom,
    resolution,
    gradientCX,
    gradientStartCY,
    gradientR,
    stopOffset1,
    stopColor1,
    stopOffset2,
    stopColor2,
    stopOffset3,
    stopColor3,
    begin,
    fromColor,
    toColor,
    colorChangeDuration,
    keySplines1,
    gradientEndCY,
    moveBegin,
    gradientMoveDuration,
    keySplines2,
  } = ctx.req.query()
  const characters = custom?.split(",") || IMAGES
  const character = characters[Math.floor(Math.random() * characters.length)]
  if (!(character && CHARACTER_NAMES.has(character))) return ctx.json({ msg: "character not found" }, 404)

  const outputResolution = resolution?.toLowerCase() === "4k" ? 4096 : 2048
  const url = new URL(ctx.req.url)
  url.pathname = `/${character}`
  url.search = ""
  const assetResponse = await ctx.env.ASSETS.fetch(new Request(url))
  if (!assetResponse.ok) return ctx.json({ msg: "assets not found" }, 404)

  const data = new Uint8Array(await assetResponse.arrayBuffer())
  let dimensions: ReturnType<typeof imageSize>
  try {
    dimensions = imageSize(data)
  } catch {
    return ctx.json({ msg: "invalid image dimensions" }, 500)
  }
  if (!(dimensions.width && dimensions.height)) return ctx.json({ msg: "invalid image dimensions" }, 500)

  const bounds = Object.hasOwn(IMAGE_GEOMETRY, character) ? IMAGE_GEOMETRY[character] : undefined
  const [contentX = 0, contentY = 0, contentWidth = dimensions.width, contentHeight = dimensions.height] =
    bounds?.length === 4 ? bounds : []
  const scale = (outputResolution * 0.9) / Math.max(contentWidth, contentHeight)
  const canvasWidth =
    contentWidth >= contentHeight ? outputResolution : Math.ceil(contentWidth * scale + outputResolution * 0.1)
  const canvasHeight =
    contentHeight >= contentWidth ? outputResolution : Math.ceil(contentHeight * scale + outputResolution * 0.1)

  return ctx.body(
    String(html`<?xml version="1.0" encoding="utf-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${canvasWidth}"
  height="${canvasHeight}"
  viewBox="0 0 ${canvasWidth} ${canvasHeight}"
  preserveAspectRatio="xMidYMid meet"
>
  <defs>
    <radialGradient id="g" gradientUnits="userSpaceOnUse" cx="${gradientCX || "50%"}" cy="${gradientStartCY || "-100%"}" r="${gradientR || "55%"}">
      <stop offset="${stopOffset1 || "0%"}" stop-color="${stopColor1 || "#ffffff"}" />
      <stop offset="${stopOffset2 || "35%"}" stop-color="${stopColor2 || "#ffffff"}" />
      <stop offset="${stopOffset3 || "100%"}" stop-color="${stopColor3 || "#000000"}">
        <animate
          attributeName="stop-color"
          begin="${begin || "cyMove.end"}"
          from="${fromColor || "#000000"}"
          to="${toColor || "#ffffff"}"
          dur="${Number.parseFloat(colorChangeDuration || "2.5") || 2.5}s"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="${keySplines1 || "0.25 0.1 0.25 1"}"
        />
      </stop>
      <animate
        id="cyMove"
        attributeName="cy"
        from="${gradientStartCY || "-100%"}"
        to="${gradientEndCY || "50%"}"
        begin="${moveBegin || "0s"}"
        dur="${Number.parseFloat(gradientMoveDuration || "4") || 4}s"
        fill="freeze"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="${keySplines2 || "0.25 0.1 0.25 1"}"
      />
    </radialGradient>
    <mask id="m">
      <rect width="100%" height="100%" fill="url(#g)" />
    </mask>
  </defs>
  <image
    x="${(canvasWidth - contentWidth * scale) / 2 - contentX * scale}" y="${(canvasHeight - contentHeight * scale) / 2 - contentY * scale}"
    width="${dimensions.width * scale}"
    height="${dimensions.height * scale}"
    href="data:${assetResponse.headers.get("Content-Type") || "application/octet-stream"};base64,${uint8ArrayToBase64(data)}"
    mask="url(#m)"
  />
</svg>`)
      .replaceAll(/>\s+</g, "><")
      .trim(),
    200,
    {
      "content-type": "image/svg+xml; charset=utf-8",
      "x-character": encodeURIComponent(character),
    },
  )
}
