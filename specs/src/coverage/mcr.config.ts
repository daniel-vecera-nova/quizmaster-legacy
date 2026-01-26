import MCR from 'monocart-coverage-reports'

export const mcr = MCR({
    name: 'Quizmaster Frontend Coverage',
    outputDir: './coverage/frontend',
    reports: ['raw'],
    baseDir: 'frontend/src',
    sourceFilter: {
        '**/*.{js,jsx,ts,tsx}': true,
        '**/node_modules/**': false,
    },
    sourcePath: {
        'frontend/src/': '',
    },
})
