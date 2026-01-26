import type { Page } from '@playwright/test'

export class QuestionPage {
    constructor(private page: Page) {}

    backButtonLocator = () => this.page.locator('button#back')
    nextButtonLocator = () => this.page.locator('button#next')
    evaluateButtonLocator = () => this.page.locator('button#evaluate')
    evaluateModalButtonLocator = () => this.page.locator('dialog #evaluate')

    submitButtonLocator = () => this.page.locator('input.submit-btn')

    private bookmarkQuestionButtonLocator = () => this.page.locator('[data-testid="bookmark-toggle"]')
    private unBookmarkQuestionButtonLocator = (title: string) =>
        this.page.locator(`[data-testid="delete-bookmark-${title}"]`)

    private progressBarLocator = (attr: string) => this.page.locator('#progress-bar').getAttribute(attr)
    progressCurrent = async () => Number.parseInt((await this.progressBarLocator('value')) ?? '')
    progressMax = async () => Number.parseInt((await this.progressBarLocator('max')) ?? '')

    back = () => this.backButtonLocator().click()
    bookmark = () => this.bookmarkQuestionButtonLocator().click()
    unBookmark = (title: string) => this.unBookmarkQuestionButtonLocator(title).click()
    next = () => this.nextButtonLocator().click()
    evaluate = () => this.evaluateButtonLocator().click()
    submit = () => this.submitButtonLocator().click()
    isCurrentQuestionBookmarked = async () =>
        (await this.bookmarkQuestionButtonLocator().getAttribute('data-bookmarked')) === 'true'

    bookmarkListLocator = (title: string) =>
        this.page.locator('[data-testid="bookmark-list"] button', { hasText: title })

    gotoBookmark = (title: string) => this.bookmarkListLocator(title).click()
}
