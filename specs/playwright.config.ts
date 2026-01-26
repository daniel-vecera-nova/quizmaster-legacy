import { defineConfig } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const port = process.env.FE_PORT || '8080'

export default defineConfig({
    fullyParallel: true,
    timeout: 20000,
    expect: {
        timeout: 10000,
    },
    workers: Number(process.env.PW_WORKERS) || 2,
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                baseURL: `http://localhost:${port}`,
                permissions: ['clipboard-read', 'clipboard-write'],
            }
        },
    ],
    testDir: defineBddConfig({
        features: 'features',
        steps: ['src/steps/fixture.ts', 'src/steps/index.ts'],
    })
})
