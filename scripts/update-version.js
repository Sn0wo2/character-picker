import { execFileSync } from "node:child_process"
import fs from "node:fs"

const PUBLIC_DIR = new URL("../public/", import.meta.url)
const VERSION_FILE = new URL("../public/.version", import.meta.url)

let hash
try {
  hash = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: new URL("../", import.meta.url) })
    .toString()
    .trim()
} catch (error) {
  console.warn('Failed to get git commit hash, using "unknown".', error.message)
  hash = "unknown"
}

let content = hash
if (fs.existsSync(VERSION_FILE)) {
  const lines = fs.readFileSync(VERSION_FILE, "utf-8").split("\n")
  lines[0] = hash
  content = lines.join("\n")
}

if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })

fs.writeFileSync(VERSION_FILE, content)
console.log(`Generated .version: ${hash}`)
