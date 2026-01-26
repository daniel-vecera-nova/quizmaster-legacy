import type { Page } from '@playwright/test'

export class QuizScorePage {
    constructor(private page: Page) {}

    private resultTableLocator = () => this.page.locator('#results')
    resultTableExists = () => this.resultTableLocator().isVisible()

    private correctAnswerLocator = () => this.page.locator('#correct-answers')
    correctAnswers = () => this.correctAnswerLocator().textContent()

    private firstCorrectAnswerLocator = () => this.page.locator('#first-correct-answers')
    firstCorrectAnswers = () => this.firstCorrectAnswerLocator().textContent().then(Number)
    firstCorrectAnswersPresent = () => this.firstCorrectAnswerLocator().isVisible()

    private totalQuestionsLocator = () => this.page.locator('#total-questions')
    totalQuestions = () => this.totalQuestionsLocator().textContent().then(Number)

    private percentageResultLocator = () => this.page.locator('#percentage-result')
    percentageResult = () => this.percentageResultLocator().textContent().then(Number)

    private firstPercentageResultLocator = () => this.page.locator('#first-percentage-result')
    firstPercentageResult = () => this.firstPercentageResultLocator().textContent().then(Number)
    firstPercentageResultPresent = () => this.firstPercentageResultLocator().isVisible()

    private passScoreLocator = () => this.page.locator('#pass-score')
    passScore = () => this.passScoreLocator().textContent().then(Number)

    private textResultLocator = () => this.page.locator('#text-result')
    textResult = () => this.textResultLocator().textContent()

    private firstTextResultLocator = () => this.page.locator('#first-text-result')
    firstTextResult = () => this.firstTextResultLocator().textContent()
    firstTextResultPresent = () => this.firstCorrectAnswerLocator().isVisible()

    private questionsLocator = () => this.page.locator('[id^=question-]')
    questions = () => this.questionsLocator().locator('[id^=question-name-]').allTextContents()

    private questionLocator = (question: string) =>
        this.page.locator('[id^=question-name-]').filter({ hasText: question }).locator('..').locator('..')

    private answerAndExplanationLocator = (question: string) =>
        this.questionLocator(question).locator('li[id^=answer-row-]')

    answerListLocator = (question: string) => this.questionLocator(question).locator('[id^=question-answers-]')

    answers = (question: string) => this.answerListLocator(question).locator('[id^=answer-label-]').allTextContents()

    explanations = (question: string) =>
        this.answerAndExplanationLocator(question).locator('.explanationText').allTextContents()

    questionExplanation = (question: string) =>
        this.questionLocator(question).locator('.question-explanation').textContent()

    private checkedUserSelectLocator = (question: string) => this.questionLocator(question).locator('input:checked')
    checkedAnswerLabel = (question: string) =>
        this.checkedUserSelectLocator(question).locator('..').locator('[id^=answer-label-]').textContent()

    private questionAnswerLocator = (question: string, answer: string) =>
        this.answerAndExplanationLocator(question).getByText(answer)
    private answerCorrespondingResponseLocator = (question: string, answer: string) =>
        this.questionAnswerLocator(question, answer).locator('..').locator('..').locator('.feedback')
    answerCorrespondingResponse = (question: string, answer: string) =>
        this.answerCorrespondingResponseLocator(question, answer).textContent()
}
