import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
        },
    },
    {
        ignores: [
            'node_modules/**/*',
            'dist/**/*',
            'build/**/*',
            'public/**/*',
            'eslint.config.js',
            'jest.config.js',
            'vite.config.ts',
        ],
    },
);