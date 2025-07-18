import type {Context} from 'hono';
import {md5} from '../../utils/hash-helper.ts';

export const errorHandler = async (err: Error, ctx: Context) => {
    const hash = await md5(new TextEncoder().encode(`${err.name}: ${err.message}`));

    return ctx.json({
        msg: 'oops, something went wrong',
        data: {trace_id: `${hash}-${Date.now()}`},
    }, 500);
};
