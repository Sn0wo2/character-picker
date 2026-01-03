import {Hono} from 'hono'
import fs from 'node:fs/promises';
import path from 'node:path';

try {
    globalThis.CHARACTER_INDEX = await fs.readFile(path.join(process.cwd(), 'public', '.index'), 'utf-8');
} catch {
    console.error('Failed to load character index');
    globalThis.CHARACTER_INDEX = '';
}

const {setupRouter} = await import('./router');

const app = new Hono();

const assetsFetcher = {
    fetch: async (input: RequestInfo | URL) => {
        const url = new URL(input instanceof Request ? input.url : input.toString());
        const pathname = url.pathname.replace(/^\//, '');
        const filePath = path.join(process.cwd(), 'public', pathname);

        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
            const data = await fs.readFile(filePath);
            const ext = path.extname(filePath).toLowerCase();
            let type = 'application/octet-stream';
            if (ext === '.png') type = 'image/png';
            else if (ext === '.jpg' || ext === '.jpeg') type = 'image/jpeg';
            else if (ext === '.json') type = 'application/json';
            else if (ext === '.txt') type = 'text/plain';
            else if (ext === '.html') type = 'text/html';

            return new Response(data, {
                headers: {'Content-Type': type},
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

const {serve} = await import('@hono/node-server');

serve({
    fetch: app.fetch,
    port,
});