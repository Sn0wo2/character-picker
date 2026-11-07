import imageGeometry from "./character-geometry.json" with { type: "json" }

export const IMAGE_GEOMETRY: Readonly<Partial<Record<string, readonly number[]>>> = imageGeometry
export const IMAGES = Object.keys(IMAGE_GEOMETRY)
export const CHARACTER_NAMES = new Set(IMAGES)
