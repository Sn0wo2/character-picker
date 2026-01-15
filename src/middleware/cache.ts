import type {Context, Next} from 'hono';

export const cacheMiddleware = async (c: Context, next: Next) => {
    c.res.headers.set(
        'Cache-Control',
        'no-store, no-cache, max-age=0'
    );
    await next();
};
