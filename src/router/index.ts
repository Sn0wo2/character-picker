import {Hono} from 'hono';
import {charactersHandler} from '../handler/api-characters';
import {characterHandler} from '../handler/character';
import {errorHandler} from '../handler/error';
import {notFoundHandler} from '../handler/notfound';
import {cache} from '../middleware/cache';
import {cors} from '../middleware/cors';

export const setupRouter = (app: Hono) => {
    const test = new Hono(); // v0 debug
    const api = new Hono(); // v1 release

    app.onError(errorHandler);
    app.notFound(notFoundHandler);

    app.use(cache);
    app.use(cors);

    app.get('/character', characterHandler);

    api.get('/characters', charactersHandler);

    test.get("/error", () => {
        throw new Error('test error');
    });

    app.route('/v0', test);
    app.route('/v1', api);
};