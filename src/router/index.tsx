import {cors} from "../middleware/cors";
import {cache} from "../middleware/cache";
import {Hono} from "hono";
import {charactersHandler} from "../handler/api-characters";
import {characterHandler} from "../handler/character";

export const api = new Hono()

export const setupRouter = (app: any) => {
    app.use(cors)
    app.use(cache)

    app.get("/character", characterHandler)

    api.get("/characters", charactersHandler)

    app.route('/v1', api)
}