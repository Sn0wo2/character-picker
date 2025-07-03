import {Hono} from 'hono';
import {charactersHandler} from '../handler/api-characters';
import {characterHandler} from '../handler/character';
import {errorHandler} from '../handler/error';
import {notFoundHandler} from '../handler/notfound';
import {cache} from '../middleware/cache';
import {cors} from '../middleware/cors';

export const api = new Hono();

export const setupRouter = (app: Hono) => {
    app.onError(errorHandler);
    app.notFound(notFoundHandler);

    app.use(cors);
    app.use(cache);

    app.get('/character', characterHandler);

    api.get('/characters', charactersHandler);

    app.route('/v1', api);
};