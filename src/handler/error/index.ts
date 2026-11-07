import type { ErrorHandler } from "hono"
import type { AppEnv } from "../../global.d.ts"

export const errorHandler: ErrorHandler<AppEnv> = (err, ctx) => {
  const req = {
    traceID: ctx.res.headers.get("x-trace-id"),
    method: ctx.req.method,
    url: ctx.req.url,
    header: ctx.req.header(),
  }

  for (const name of ["authorization", "proxy-authorization", "cookie", "x-api-key"]) {
    if (name in req.header) req.header[name] = "[REDACTED]"
  }

  console.error("Global Error Handler Caught Exception", err, req)

  return ctx.json(
    {
      msg: "oops, something went wrong",
      data: {
        req,
        error: {
          name: err.name,
          message: err.message,
          stack: import.meta.env.DEV ? err.stack : undefined,
          cause: import.meta.env.DEV ? err.cause : undefined,
        },
      },
    },
    500,
  )
}
