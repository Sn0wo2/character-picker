/// <reference types="vite/client" />

export type AppEnv = {
  Bindings: {
    ASSETS: Pick<CloudflareBindings["ASSETS"], "fetch">
  }
}

declare global {
  // keep use var.
  var CHARACTER_INDEX: string
  var VERSION: string
}
