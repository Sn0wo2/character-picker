import type {Context} from 'hono';
import {logger} from "../../utils/logger.ts";

export const errorHandler = async (err: Error, ctx: Context) => {
    const traceID = ctx.res.headers.get('x-trace-id');
    const req = {
        traceID,
        method: ctx.req.method,
        url: ctx.req.url,
        header: ctx.req.header(),
    }

    logger.error({
        msg: "Global Error Handler Caught Exception",
        err,
        req,
    })

    return ctx.json({
        msg: 'oops, something went wrong',
        data: {
            req,
            error: {
                name: err.name,
                message: err.message,
                stack: err.stack,
                cause: err.cause
            }
        },
    }, 500);
};
