import fs from "node:fs"
import { PNG } from "pngjs"
import { parseMetadata } from "../src/utils/metadata.ts"

const PUBLIC_DIR = new URL("../public/", import.meta.url)
const INDEX_FILE = new URL("../public/.index", import.meta.url)
const GEOMETRY_FILE = new URL("../src/assets/character-geometry.json", import.meta.url)

const indexedFiles = parseMetadata(fs.readFileSync(INDEX_FILE, "utf-8"))
const indexedFileSet = new Set(indexedFiles)

let geometry = Object.create(null)
let geometryModifiedAt = 0
if (fs.existsSync(GEOMETRY_FILE)) {
  geometry = Object.assign(Object.create(null), JSON.parse(fs.readFileSync(GEOMETRY_FILE, "utf-8")))
  geometryModifiedAt = fs.statSync(GEOMETRY_FILE).mtimeMs
}

let changed = false
for (const file of indexedFiles) {
  try {
    const filePath = new URL(file.split("/").map(encodeURIComponent).join("/"), PUBLIC_DIR)
    if (Object.hasOwn(geometry, file) && geometry[file] && fs.statSync(filePath).mtimeMs <= geometryModifiedAt) continue

    const { width, height, data } = PNG.sync.read(fs.readFileSync(filePath))
    let minX = width
    let minY = height
    let maxX = -1
    let maxY = -1

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] === 0) continue
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }

    geometry[file] = maxX < minX || maxY < minY ? [0, 0, width, height] : [minX, minY, maxX - minX + 1, maxY - minY + 1]
    changed = true
  } catch (error) {
    if (Object.hasOwn(geometry, file)) {
      delete geometry[file]
      changed = true
    }
    console.warn(`Skipped geometry for ${file}: ${error.message}`)
  }
}

for (const file of Object.keys(geometry)) {
  if (indexedFileSet.has(file)) continue
  delete geometry[file]
  changed = true
}

if (changed || !fs.existsSync(GEOMETRY_FILE)) {
  fs.writeFileSync(GEOMETRY_FILE, JSON.stringify(geometry))
  console.log(`Updated geometry for ${Object.keys(geometry).length} images.`)
} else {
  console.log("Image geometry is up to date.")
}
