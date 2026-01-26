import type { Page } from '@playwright/test'

export class HomePage {
    constructor(private page: Page) {}

    // Navigate to the home page
    goto = () => this.page.goto('/')

    // Wait for the home page to load
    waitForLoaded = () => this.page.waitForSelector('h1:has-text("Welcome to Quizmaster! You rock.")')

    // Locators for the links
    createQuestionLink = () => this.page.locator('a[href="/question/new"]')
    createWorkspaceLink = () => this.page.locator('a[href="/workspace/new"]')

    // Methods to check if links exist and have correct href
    hasCreateQuestionLink = async () => {
        const link = this.createQuestionLink()
        await link.waitFor({ state: 'visible' })
        return link.isVisible()
    }

    hasCreateWorkspaceLink = async () => {
        const link = this.createWorkspaceLink()
        await link.waitFor({ state: 'visible' })
        return link.isVisible()
    }
}
