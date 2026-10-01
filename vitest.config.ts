import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
    test: {
        include: ['tests/unit/**/*.test.ts'],
    },
    resolve: {
        alias: {
            '@layouts': path.resolve(import.meta.dirname, './src/layouts'),
            '@components': path.resolve(import.meta.dirname, './src/components'),
            '@data': path.resolve(import.meta.dirname, './src/data/info'),
            '@utils': path.resolve(import.meta.dirname, './src/utils'),
            '@types': path.resolve(import.meta.dirname, './src/types'),
            '@lib': path.resolve(import.meta.dirname, './src/lib'),
        },
    },
});
