import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import type { AppEnv } from "./global.d.ts"
import app from "./index.ts"

const PATH_SEPARATOR = /[\\/]/

const assets = new Hono()
assets.use("*", async (ctx, next) => {
  let pathname: string
  try {
    pathname = decodeURIComponent(ctx.req.path)
  } catch {
    return ctx.notFound()
  }
  if (pathname.split(PATH_SEPARATOR).some((segment) => segment.startsWith("."))) return ctx.notFound()
  return await next()
})
assets.use("*", serveStatic({ root: "./public" }))

const bindings: AppEnv["Bindings"] = {
  ASSETS: { fetch: async (input, init) => assets.fetch(new Request(input, init)) },
}

serve(
  {
    fetch: async (request) => {
      if (request.method === "GET" || request.method === "HEAD") {
        const response = await assets.fetch(request)
        if (response.status !== 404) return response
      }
      return app.fetch(request, bindings)
    },
    port: 3030,
  },
  (info) => console.log(`Server is running on http://localhost:${info.port}`),
)
