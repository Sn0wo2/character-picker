import { build } from "bun"
import { metadataDefinitions } from "./metadata.ts"

const result = await build({
  entrypoints: ["./src/entry-node.ts"],
  outdir: "./build",
  naming: "index.js",
  target: "node",
  format: "esm",
  sourcemap: "external",
  define: { ...metadataDefinitions, "import.meta.env.DEV": "false" },
})

if (!result.success) {
  console.error(...result.logs)
  process.exit(1)
}
