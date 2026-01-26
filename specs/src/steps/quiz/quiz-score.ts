import { expect } from '@playwright/test'

import { Given, Then } from 'steps/fixture.ts'

Given('I finish the quiz', async function () {
    await this.page.goto('quiz/score')
})

Then(
    /^I see the result (\d+.?\d*) correct out of (\d+), (\d+)%, (passed|failed), required passScore (\d+)%/,
    async function (
        expectedCorrectAnswers: string,
        expectedTotalQuestions: number,
        expectedPercentage: number,
        expectedTextResult: string,
        expectedPassScore: number,
    ) {
        const correctAnswers = await this.quizScorePage.correctAnswers()
        expect(correctAnswers).toBe(expectedCorrectAnswers)

        const totalQuestions = await this.quizScorePage.totalQuestions()
        expect(totalQuestions).toBe(expectedTotalQuestions)

        const result = await this.quizScorePage.percentageResult()
        expect(result).toBe(expectedPercentage)

        const textResult = await this.quizScorePage.textResult()
        expect(textResult).toBe(expectedTextResult)

        const passScore = await this.quizScorePage.passScore()
        expect(passScore).toBe(expectedPassScore)
    },
)

Then(/^I see the correct number of questions (\d+)/, async function (expectedTotalQuestions: number) {
    const totalQuestions = await this.quizScorePage.totalQuestions()
    expect(totalQuestions).toBe(expectedTotalQuestions)
})

Then(
    /^I see the original result (\d+), (\d+)%, (passed|failed)/,
    async function (
        expectedOriginalCorrectAnswers: number,
        expectedOriginalPercentage: number,
        expectedOriginalTextResult: string,
    ) {
        const firstCorrectAnswers = await this.quizScorePage.firstCorrectAnswers()
        expect(firstCorrectAnswers).toBe(expectedOriginalCorrectAnswers)

        const result = await this.quizScorePage.firstPercentageResult()
        expect(result).toBe(expectedOriginalPercentage)

        const textResult = await this.quizScorePage.firstTextResult()
        expect(textResult).toBe(expectedOriginalTextResult)
    },
)

Then(/^I don't see the original results/, async function () {
    const firstCorrectAnswers = await this.quizScorePage.firstCorrectAnswersPresent()
    expect(firstCorrectAnswers).toBe(false)

    const result = await this.quizScorePage.firstPercentageResultPresent()
    expect(result).toBe(false)

    const textResult = await this.quizScorePage.firstTextResultPresent()
    expect(textResult).toBe(false)
})

Then('I see the question {string}', async function (question: string) {
    const questions: string[] = await this.quizScorePage.questions()
    expect(questions).toContain(question)
})

Then('I see all options for question {string}', async function (question: string) {
    const answersOrig = this.questionBookmarks[question].answers

    const answers: string[] = await this.quizScorePage.answers(question)

    expect(answers.length).toBe(answersOrig.length)

    for (const answer of answersOrig) {
        expect(answers).toContain(answer.answer)
    }
})

Then('I see explanation {string} for question {string}', async function (explanation: string, question: string) {
    const explanations: string[] = await this.quizScorePage.explanations(question)

    expect(explanations).toContain(explanation)
})

Then(
    'I see question explanation {string} for question {string}',
    async function (explanationOrig: string, question: string) {
        const explanation = await this.quizScorePage.questionExplanation(question)

        expect(explanation).toBe(explanationOrig)
    },
)

Then('I see user select {string} for question {string}', async function (userSelect: string, question: string) {
    const answerLabel = await this.quizScorePage.checkedAnswerLabel(question)

    expect(answerLabel).toBe(userSelect)
})

Then(
    'I see corresponding response {string} for answer {string} for question {string}',
    async function (response: string, answer: string, question: string) {
        const answerResponse = await this.quizScorePage.answerCorrespondingResponse(question, answer)

        expect(answerResponse).toBe(response)
    },
)
