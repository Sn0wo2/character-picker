import {cloudflare} from '@cloudflare/vite-plugin';
import {defineConfig} from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
    plugins: [
        cloudflare()
    ],
    define: {
        'globalThis.CHARACTER_INDEX': JSON.stringify(fs.readFileSync(path.join(process.cwd(), 'public', '.index'), 'utf-8')),
        'globalThis.VERSION': JSON.stringify(fs.readFileSync(path.join(process.cwd(), 'public', '.version'), 'utf-8')),
    },
    environments: {
        character_picker: {
            build: {
                emptyOutDir: true,
                sourcemap: true,
            }
        }
    },
    build: {
        minify: true,
        sourcemap: true,
    },
});
