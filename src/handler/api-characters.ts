import type {Context} from 'hono';
import {IMAGES} from '../assets/character.ts';

export const charactersHandler = async (ctx: Context) => {
    return ctx.json({
        msg: '/:image',
        data: {
            characters: IMAGES
        }
    });
};