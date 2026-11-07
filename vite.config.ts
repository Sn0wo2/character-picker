import { cloudflare } from "@cloudflare/vite-plugin"
import { defineConfig } from "vite"
import { metadataDefinitions } from "./scripts/metadata.ts"

export default defineConfig({
  plugins: [cloudflare()],
  define: metadataDefinitions,
  environments: {
    character_picker: {
      build: {
        emptyOutDir: true,
        sourcemap: true,
      },
    },
  },
  build: {
    minify: true,
    sourcemap: true,
  },
})
