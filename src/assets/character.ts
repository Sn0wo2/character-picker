import { parseMetadata } from "../utils/metadata.ts"
import imageGeometry from "./character-geometry.json" with { type: "json" }

export const IMAGES = parseMetadata(globalThis.CHARACTER_INDEX || "")
export const CHARACTER_NAMES = new Set(IMAGES)
export const IMAGE_GEOMETRY: Readonly<Partial<Record<string, readonly number[]>>> = imageGeometry
