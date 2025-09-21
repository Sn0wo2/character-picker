import type {Context, Next} from 'hono';

export const cors = async (ctx: Context, next: Next) => {
    ctx.res.headers.set('Access-Control-Allow-Origin', '*');
    ctx.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    ctx.res.headers.set('Access-Control-Max-Age', '86400');

    if (ctx.req.method === 'OPTIONS') {
        return ctx.json({
            msg: 'success'
        }, 200)
    }

    await next();
};
