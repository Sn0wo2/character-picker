import {defineConfig} from 'vite';
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
    define: {
        'globalThis.CHARACTER_INDEX': JSON.stringify(fs.readFileSync(path.join(process.cwd(), 'public', '.index'), 'utf-8')),
        'globalThis.VERSION': JSON.stringify(fs.readFileSync(path.join(process.cwd(), 'public', '.version'), 'utf-8')),
    },
    build: {
        target: 'node18',
        ssr: true,
        lib: {
            entry: 'src/entry-node.ts',
            formats: ['es'],
            fileName: 'server',
        },
        rollupOptions: {
            external: [
                /node:.*/,
            ],
        },
        outDir: 'dist/node',
    },
});