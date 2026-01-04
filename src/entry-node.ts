import {Hono} from 'hono'
import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime-types';
import {serve} from "@hono/node-server";

try {
    globalThis.CHARACTER_INDEX = await fs.readFile(path.join(process.cwd(), 'public', '.index'), 'utf-8');
    globalThis.VERSION = await fs.readFile(path.join(process.cwd(), 'public', '.version'), 'utf-8');
} catch {
    console.error('Failed to load character index or version');
    globalThis.CHARACTER_INDEX = '';
    globalThis.VERSION = '';
}

const {setupRouter} = await import('./router');

const app = new Hono();

const assetsFetcher = {
    fetch: async (input: RequestInfo | URL) => {
        const url = new URL(input instanceof Request ? input.url : input.toString());
        const pathname = url.pathname.replace(/^\//, '');
        const filePath = path.join(process.cwd(), 'public', pathname);

        if (await fs.stat(filePath)) {

            return new Response(await fs.readFile(filePath), {
                headers: {'Content-Type': mime.lookup(filePath) || 'application/octet-stream'},
            });
        }
        return new Response('Not Found', {status: 404});
    },
};

app.use('*', async (c, next) => {
    const env = c.env || {};
    c.env = {
        ...env,
        ASSETS: assetsFetcher,
    };
    await next();
});

setupRouter(app);

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});