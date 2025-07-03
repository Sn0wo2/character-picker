import type {Context, Next} from 'hono';

export const cache = async (c: Context, next: Next) => {
    c.res.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
    );
    c.res.headers.set('Pragma', 'no-cache');
    c.res.headers.set('Expires', '0');
    await next();
};
