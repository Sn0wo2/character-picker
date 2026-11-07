import { readFileSync } from "node:fs"
import { URL } from "node:url"

export const metadataDefinitions = {
  "globalThis.CHARACTER_INDEX": JSON.stringify(readFileSync(new URL("../public/.index", import.meta.url), "utf-8")),
  "globalThis.VERSION": JSON.stringify(readFileSync(new URL("../public/.version", import.meta.url), "utf-8")),
}
