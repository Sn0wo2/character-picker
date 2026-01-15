import {createMiddleware} from 'hono/factory';
import {logger} from '../utils/logger';

export const loggerMiddleware = createMiddleware(async (c, next) => {
    const start = Date.now();
    const {method, url} = c.req;
    const traceID = crypto.randomUUID();

    c.header('x-trace-id', traceID);

    logger.info({
        msg: 'Incoming request',
        method,
        url,
        traceID
    });

    await next();

    const ms = Date.now() - start;
    const status = c.res.status;

    logger.info({
        msg: 'Request completed',
        method,
        url,
        status,
        responseTime: ms,
        traceID
    });
});