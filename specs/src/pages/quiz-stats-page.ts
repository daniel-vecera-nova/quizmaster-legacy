import type { Page } from '@playwright/test'

export class QuizStatsPage {
    constructor(private page: Page) {}

    public pageHeadingLocator = () => this.page.locator('h2')
    public statsTableLocator = () => this.page.locator('table')
    public statsTableBodyRowsLocator = () => this.page.locator('table tbody tr')
}
