import {type Context, Hono, type Next} from 'hono'
import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime-types';
import {serve} from "@hono/node-server";
import {setupRouter} from './router';

try {
    globalThis.CHARACTER_INDEX = await fs.readFile(path.join(process.cwd(), 'public', '.index'), 'utf-8');
    globalThis.VERSION = await fs.readFile(path.join(process.cwd(), 'public', '.version'), 'utf-8');
} catch {
    console.error('Failed to load character index or version');
    globalThis.CHARACTER_INDEX = '';
    globalThis.VERSION = '';
}

const app = new Hono();

app.use('*', async (c: Context, next: Next) => {
    const env = c.env || {};
    c.env = {
        ...env,
        ASSETS: {
            fetch: app.fetch
        },
    };
    await next();
});

app.get('/*', async (c: Context, next: Next) => {
    const pathname = c.req.path.replace(/^/, '');
    const filePath = path.join(process.cwd(), 'public', pathname);

    try {
        if ((await fs.stat(filePath)).isFile()) {
            return c.body(await fs.readFile(filePath), 200, {'content-type': mime.lookup(filePath) || 'application/octet-stream'});
        }
    } catch {
    }
    return next()
});

setupRouter(app);

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});
