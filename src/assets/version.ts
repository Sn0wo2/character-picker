import { parseMetadata } from "../utils/metadata.ts"

export const [VERSION_HASH = "dev", PROJECT_URL = "https://github.com/Sn0wo2/character-picker"] = parseMetadata(
  globalThis.VERSION || "",
)
