import type {Context} from 'hono';
import {md5} from "../../utils/hash-helper.ts";

export const errorHandler = (err: Error, ctx: Context) => {
    return ctx.json({
        msg: 'oops, something went wrong',
        data: {
            trace_id: `${md5(new TextEncoder().encode(`${err.name}: ${err.message}`))}-${new Date().getTime()}`
        },
    }, 500);
};

