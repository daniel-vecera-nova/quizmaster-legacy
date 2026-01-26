import type { Page } from '@playwright/test'

export class QuizWelcomePage {
    constructor(private page: Page) {}

    header = () => this.page.locator('h1').textContent()
    name = () => this.page.locator('h2#quiz-name').textContent()
    description = () => this.page.locator('p#quiz-description').textContent()
    questionCount = async () => Number.parseInt((await this.page.locator('span#question-count').textContent()) ?? '')
    feedback = () => this.page.locator('span#question-feedback').textContent()
    passScore = async () => Number.parseInt((await this.page.locator('span#pass-score').textContent()) ?? '')
    timeLimit = async () => Number.parseInt((await this.page.locator('span#time-limit').textContent()) ?? '')

    startButton = () => this.page.locator('button#start')
    start = () => this.startButton().click()
}
