import {Hono} from 'hono'
import {setupRouter} from "./router";

const app = new Hono()

setupRouter(app)

export default app