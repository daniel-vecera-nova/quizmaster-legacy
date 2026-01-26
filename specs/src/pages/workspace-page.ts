import type { Page } from '@playwright/test'

export class WorkspacePage {
    constructor(private page: Page) {}

    goto = (guid: string) => this.page.goto(`/workspace/${guid}`)

    private workspaceNameLocator = () => this.page.getByTestId('workspace-title')
    workspaceNameValue = () => this.workspaceNameLocator().textContent()

    private questionsLocator = () => this.page.locator('.question-item')

    questionCount = () => this.questionsLocator().count()
    private questionLocator = (question: string) => this.questionsLocator().filter({ hasText: question })

    private quizLocator = (quiz: string) => this.page.locator('.quiz-item').filter({ hasText: quiz })

    private clickQuestionButtonLocator = (button: string) => async (question: string) =>
        await this.questionLocator(question).locator(button).click()

    private clickQuizButtonLocator = (button: string) => async (quiz: string) =>
        await this.quizLocator(quiz).locator(button).click()
    takeQuestion = this.clickQuestionButtonLocator('.take-button button')
    editQuestion = this.clickQuestionButtonLocator('.edit-button button')
    copyTakeQuestion = this.clickQuestionButtonLocator('.copy-take-button button')
    copyEditQuestion = this.clickQuestionButtonLocator('.copy-edit-button button')
    takeQuiz = this.clickQuizButtonLocator('.take-quiz-button button')
    statsQuiz = this.clickQuizButtonLocator('.stats-quiz-button button')

    private createQuestionButtonLocator = () => this.page.locator('#create-question')
    createNewQuestion = async () => this.createQuestionButtonLocator().click()

    addExistingQuestion = async () => this.page.locator('#add-existing-question').click()
    fillInQuestion = async (question: string) => this.page.locator('#question-input-field').fill(question)
    errorMessageLabel = () => this.page.locator('#error-message-label')

    createNewQuiz = () => this.page.locator('#create-quiz').click()

    hasQuiz = (quiz: string) => this.quizLocator(quiz).isVisible()
}
