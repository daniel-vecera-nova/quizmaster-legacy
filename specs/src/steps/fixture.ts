import { promises as fs } from 'node:fs'
import path from 'node:path'
import { test as base, createBdd } from 'playwright-bdd'
import { QuizmasterWorld } from 'steps/world/world.ts'
import { mcr } from 'coverage/mcr.config.ts'

export const test = base.extend<{ world: QuizmasterWorld }>({
    world: async ({ page }, use, testInfo) => {
        const world = new QuizmasterWorld(page, testInfo)
        await use(world)
    },
})

export const { Given, When, Then, BeforeScenario, After, AfterScenario, AfterAll } = createBdd(test, {
    worldFixture: 'world',
})

const ENABLE_COVERAGE = process.env.ENABLE_COVERAGE === '1'
const FEATURE_FLAG_ENABLED: boolean = process.env.FEATURE_FLAG === 'true'

BeforeScenario(async function ({ $tags, $test }) {
    const hasFeatureFlag = $tags.includes('@feature-flag')
    const hasNotFeatureFlag = $tags.includes('@not-feature-flag')
    if (hasFeatureFlag && !FEATURE_FLAG_ENABLED) $test.skip()
    if (hasNotFeatureFlag && FEATURE_FLAG_ENABLED) $test.skip()

    if (!ENABLE_COVERAGE) return

    await this.page.coverage.startJSCoverage({
        resetOnNavigation: false,
    })
})

const screenshotsDir = path.join(__dirname, '../../../site/docs/screenshots')
fs.mkdir(screenshotsDir, { recursive: true })

After(async function ({ $tags, $testInfo }) {
    const screenshotTag = $tags.find(tag => tag.startsWith('@screenshot:'))
    if (!screenshotTag) return

    const [filename, example] = screenshotTag.replace('@screenshot:', '').split(':')

    if (filename && (!example || $testInfo.title === `Example #${example}`)) {
        const screenshotPath = path.join(screenshotsDir, filename)
        await this.page.screenshot({ path: screenshotPath })
    }
})

AfterScenario(async function () {
    if (!ENABLE_COVERAGE) return

    const jsCoverage = await this.page.coverage.stopJSCoverage()
    await mcr.add(jsCoverage)
})

AfterAll(async () => {
    if (!ENABLE_COVERAGE) return
    await mcr.generate()
})
