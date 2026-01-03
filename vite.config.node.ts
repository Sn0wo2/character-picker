import {defineConfig} from 'vite';

export default defineConfig({
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