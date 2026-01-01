import {cloudflare} from '@cloudflare/vite-plugin';
import {defineConfig} from 'vite';
import ssrPlugin from 'vite-ssr-components/plugin';

export default defineConfig({
    plugins: [cloudflare(), ssrPlugin()],
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
