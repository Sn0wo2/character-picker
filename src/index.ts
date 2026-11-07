import { Hono } from "hono"
import { IMAGES } from "./assets/character.ts"
import { PROJECT_URL, VERSION_HASH } from "./assets/version.ts"
import type { AppEnv } from "./global.d.ts"
import { characterHandler } from "./handler/character.ts"
import { errorHandler } from "./handler/error/index.ts"

const app = new Hono<AppEnv>()

app.onError(errorHandler)
app.notFound((ctx) => ctx.json({ msg: "router not found" }, 404))

app.use(async (ctx, next) => {
  const start = Date.now()
  const { method, url } = ctx.req
  const traceID = crypto.randomUUID()

  ctx.header("x-trace-id", traceID)
  ctx.header("x-version", VERSION_HASH)
  ctx.header("x-project", PROJECT_URL)
  ctx.header("Cache-Control", "no-store, no-cache, max-age=0")
  ctx.header("Access-Control-Allow-Origin", "*")
  ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  ctx.header("Access-Control-Max-Age", "86400")

  console.info({ msg: "Incoming request", method, url, traceID })

  if (method === "OPTIONS") {
    ctx.res = ctx.json({ msg: "success" }, 200)
  } else {
    await next()
  }

  console.info({
    msg: "Request completed",
    method,
    url,
    status: ctx.res.status,
    responseTime: Date.now() - start,
    traceID,
  })
})

app.get("/v0/error", () => {
  const error = new Error("Intentional debug error triggered")
  error.name = "DebugError"
  throw error
})

app.get("/v1/characters", (ctx) =>
  ctx.json({
    msg: "/:image",
    data: { characters: IMAGES },
  }),
)

app.use("*", characterHandler)

export default app
