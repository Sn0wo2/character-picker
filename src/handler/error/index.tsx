import {Context} from "hono";

export const errorHandler = (err: Error, ctx: Context) => {
    const timestamp = new Date().getTime();
    console.log(timestamp, err)

    return ctx.json({
        msg: 'Internal Server Error',
        data: {
            trace_id: timestamp
        },
    }, 500);
}