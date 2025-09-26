import type {Context} from 'hono';
import {md5} from '../../utils/hash-helper.ts';

export const errorHandler = async (err: Error, ctx: Context) => {
    const traceID = `${await md5(new TextEncoder().encode(err.name + err.message))}:${Date.now()}`

    console.error("TraceID:", traceID, "\n", err)

    return ctx.json({
        msg: 'oops, something went wrong',
        data: {
            traceID: traceID,
            error: {
                name: err.name,
                message: err.message,
                stack: err.stack,
                cause: err.cause
            }
        },
    }, 500);
};
