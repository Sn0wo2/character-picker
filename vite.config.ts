import {cloudflare} from '@cloudflare/vite-plugin';
import {defineConfig} from 'vite';
import ssrPlugin from 'vite-ssr-components/plugin';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
    plugins: [cloudflare(), ssrPlugin()],
    define: {
        'globalThis.CHARACTER_INDEX': JSON.stringify(fs.readFileSync(path.join(process.cwd(), 'public', '.index'), 'utf-8')),
        'globalThis.VERSION': JSON.stringify(fs.readFileSync(path.join(process.cwd(), 'public', '.version'), 'utf-8')),
    },
    build: {
        rollupOptions: {
            input: {
                index: './src/index.ts',
            },
            output: {
                entryFileNames: '_worker.js',
            },
        },
    },
});
