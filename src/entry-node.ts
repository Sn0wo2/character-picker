import {type Context, Hono, type Next} from 'hono'
import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime-types';
import {serve} from "@hono/node-server";
import {setupRouter} from './router';

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

app.get('*', async (c: Context, next: Next) => {
    const pathname = c.req.path;
    const filePath = path.join(process.cwd(), 'public', pathname);

    try {
        const stat = await fs.stat(filePath);
        if (stat.isFile()) {
            return c.body(await fs.readFile(filePath), 200, {'content-type': mime.lookup(filePath) || 'application/octet-stream'});
        }
    } catch {
        // ignore
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
