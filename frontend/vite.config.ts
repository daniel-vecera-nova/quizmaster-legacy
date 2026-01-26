import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    define: {
        FEATURE_FLAG_ENABLED: process.env.FEATURE_FLAG === 'true',
    },
    build: {
        outDir: '../backend/src/main/resources/static',
        emptyOutDir: true,
    },
    server: {
        proxy: {
            '/api': 'http://localhost:8080',
        },
    },
})
