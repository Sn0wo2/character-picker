import type {Context} from 'hono';
import {IMAGES} from '../character';

export const charactersHandler = async (ctx: Context) => {
    return ctx.json({
        msg: '/:image',
        data: {
            characters: IMAGES
        }
    });
};