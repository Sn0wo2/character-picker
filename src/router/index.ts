import {Hono} from 'hono';
import {charactersHandler} from '../handler/api-characters';
import {characterHandler} from '../handler/character';
import {errorHandler} from '../handler/error';
import {cache} from '../middleware/cache';
import {cors} from '../middleware/cors';
import {version} from "../middleware/version.ts";

export const setupRouter = (app: Hono) => {
    app.onError(errorHandler);

    app.use(version)
    app.use(cache);
    app.use(cors);


    app.notFound(characterHandler);

    const test = new Hono(); // v0 debug
    const api = new Hono(); // v1 release

    test.get("/error", () => {
        throw new Error('test error');
    });

    api.get('/characters', charactersHandler);

    app.route('/v0', test);
    app.route('/v1', api);
};
