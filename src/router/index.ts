import {Hono} from 'hono';
import {charactersHandler} from '../handler/api-characters';
import {characterHandler} from '../handler/character';
import {errorHandler} from '../handler/error';
import {notFoundHandler} from "../handler/notfound";
import {cacheMiddleware} from "../middleware/cache.ts";
import {versionMiddleware} from "../middleware/version.ts";
import {corsMiddleware} from "../middleware/cors.ts";
import {loggerMiddleware} from "../middleware/logger.ts";
import {DebugError} from "../handler/error/definitions.ts";

export const setupRouter = (app: Hono) => {
    app.onError(errorHandler);
    app.notFound(notFoundHandler)

    app.use(loggerMiddleware)
    app.use(versionMiddleware)
    app.use(cacheMiddleware);
    app.use(corsMiddleware);

    const test = new Hono(); // v0 debug
    const api = new Hono(); // v1 release

    test.get("/error", () => {
        throw new DebugError('Intentional debug error triggered');
    });

    api.get('/characters', charactersHandler);

    app.route('/v0', test);
    app.route('/v1', api);

    app.use("*", characterHandler);
};