import fs from "node:fs"
import { parseMetadata } from "../src/utils/metadata.ts"

const PUBLIC_DIR = new URL("../public/", import.meta.url)
const INDEX_FILE = new URL("../public/.index", import.meta.url)
const IGNORE_FILE = new URL("../public/.assetsignore", import.meta.url)

const ignoredFiles = new Set([".assetsignore", ".index", ".version"])
if (fs.existsSync(IGNORE_FILE)) {
  const content = fs.readFileSync(IGNORE_FILE, "utf-8")
  for (const line of content.split(/\r?\n/)) {
    const file = line.trim()
    if (file && !file.startsWith("#")) ignoredFiles.add(file)
  }
}

const currentFiles = fs
  .readdirSync(PUBLIC_DIR, { withFileTypes: true })
  .filter((entry) => {
    if (ignoredFiles.has(entry.name)) return false
    if (entry.isFile()) return true
    if (!entry.isSymbolicLink()) return false
    try {
      return fs.statSync(new URL(encodeURIComponent(entry.name), PUBLIC_DIR)).isFile()
    } catch {
      return false
    }
  })
  .map((entry) => entry.name)

let indexContent = ""
if (fs.existsSync(INDEX_FILE)) {
  indexContent = fs.readFileSync(INDEX_FILE, "utf-8")
}

const existingFiles = new Set(parseMetadata(indexContent))

const newFiles = currentFiles.filter((file) => !existingFiles.has(file))

if (newFiles.length === 0) {
  console.log("No new files to add.")
} else {
  const now = new Date()
  let appendContent = ""

  if (indexContent.length > 0 && !indexContent.endsWith("\n\n")) {
    appendContent += "\n"
  }

  appendContent += `// (Added on ${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")})\n`
  appendContent += `${newFiles.join("\n")}\n`

  try {
    fs.appendFileSync(INDEX_FILE, appendContent)
    console.log(`Added ${newFiles.length} new files to .index`)
  } catch (e) {
    console.error("Error:", e)
  }
}
