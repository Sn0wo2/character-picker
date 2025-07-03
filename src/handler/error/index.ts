import type {Context} from 'hono';

export const errorHandler = (err: Error, ctx: Context) => {
    const timestamp = new Date().getTime();
    console.log(timestamp, err);

    return ctx.json({
        msg: 'oops, something went wrong',
        data: {
            trace_id: timestamp
        },
    }, 500);
};