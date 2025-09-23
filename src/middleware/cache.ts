import type {Context, Next} from 'hono';

export const cache = async (c: Context, next: Next) => {
    c.res.headers.set('Cache-Control', 'no-cache');
    
    await next();
};
