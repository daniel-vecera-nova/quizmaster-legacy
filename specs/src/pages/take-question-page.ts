import type { Page } from '@playwright/test'

export class TakeQuestionPage {
    constructor(private page: Page) {}

    private questionLocator = () => this.page.locator('h1')
    questionText = () => this.questionLocator().textContent()

    waitForLoaded = () => this.page.waitForSelector('h1')

    answersLocator = () => this.page.locator('li')
    answerLocator = (answer: string) => this.page.locator(`li:has(input[value="${answer}"])`)

    answerRowLocator = (answer: string) => this.answerLocator(answer).locator('.answer-input-row')
    answerFeedbackLocator = (answer: string) => this.answerRowLocator(answer).locator('.answer-feedback')
    answerCheckLocator = (answer: string) => this.answerRowLocator(answer).locator('input')
    answerCheckNthLocator = (number: number) => this.answersLocator().nth(number).locator('input')
    answerExplanationLocator = (answer: string) => this.answerLocator(answer).locator('.explanation')

    correctAnswersCountLocator = () => this.page.locator('.correct-answers-count')
    correctAnswersCountNumber = async () => Number(await this.correctAnswersCountLocator().textContent())

    selectAnswer = (answer: string) => this.answerCheckLocator(answer).check()
    selectAnswerNth = (number: number) => this.answerCheckNthLocator(number).check()
    unselectAnswer = (answer: string) => this.answerCheckLocator(answer).uncheck()
    isAnswerSelected = (answer: string) => this.answerCheckLocator(answer).isChecked()
    selectedAnswersLocator = () => this.answersLocator().locator('input:checked')

    submitButtonLocator = () => this.page.locator('input[type="submit"]')
    submit = () => this.submitButtonLocator().click()
    submitButtonIsDisabled = () => this.submitButtonLocator().isDisabled()

    questionFeedbackLocator = () => this.page.locator('p.question-feedback')
    questionScoreLocator = () => this.page.locator('p.question-score')
    questionExplanationLocator = () => this.page.locator('p.question-explanation')
}
