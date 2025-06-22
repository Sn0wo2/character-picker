import {Context} from "hono";

export const notFoundHandler = (c: Context) => {
    return c.json({
        msg: 'Not Found',
    }, 404);
}