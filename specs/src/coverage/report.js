import { CoverageReport } from 'monocart-coverage-reports'

const coverageReport = new CoverageReport({
    name: 'Quizmaster Frontend Coverage',
    inputDir: ['./coverage/node/raw', './coverage/frontend/raw'],
    outputDir: '../site/coverage',
    reports: ['v8'],
    baseDir: 'frontend/src',
    sourceFilter: {
        '**/*.{js,jsx,ts,tsx}': true,
        '**/node_modules/**': false,
    },
    sourcePath: {
        'frontend/': '',
    },
})

await coverageReport.generate()
