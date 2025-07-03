import type {Context} from 'hono';

export const notFoundHandler = (c: Context) => {
    return c.json({
        msg: 'router not found',
    }, 404);
};