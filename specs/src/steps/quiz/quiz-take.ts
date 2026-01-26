import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { When, Then } from 'steps/fixture.ts'
import type { QuizmasterWorld } from 'steps/world/world.ts'

const answer = async (world: QuizmasterWorld, n: number) => {
    await world.takeQuestionPage.selectAnswerNth(n)
    await world.takeQuestionPage.submit()
}

const answerCorrectly = (world: QuizmasterWorld) => async () => answer(world, 0)
const answerIncorrectly = (world: QuizmasterWorld) => async () => answer(world, 1)

const nTimes = async (n: number, fn: () => Promise<void>) => {
    for (let i = 0; i < n; i++) await fn()
}

When('I answer the question', async function () {
    await answerCorrectly(this)()
})

When('I answer correctly', async function () {
    await answerCorrectly(this)()
})

When('I answer incorrectly', async function () {
    await answerIncorrectly(this)()
})

When('I answer {int} questions correctly', async function (correct: number) {
    await nTimes(correct, answerCorrectly(this))
})

When('I answer {int} questions incorrectly', async function (incorrect: number) {
    await nTimes(incorrect, answerIncorrectly(this))
})

When('I progress through the questions', async function () {
    const quiz = this.quizBookmarks[this.activeQuizBookmark]
    const questionIds = quiz.questionIds

    // Build reverse lookup: question ID -> bookmark
    const idToBookmark: Record<number, string> = {}
    for (const [bookmark, question] of Object.entries(this.questionBookmarks)) {
        const id = Number.parseInt(question.url.split('/').pop() || '0')
        idToBookmark[id] = bookmark
    }

    // Progress through each question
    for (const questionId of questionIds) {
        const bookmark = idToBookmark[questionId]
        await this.takeQuestionPage.waitForLoaded()

        // Check if correct answers count is visible and record it
        const countLocator = this.takeQuestionPage.correctAnswersCountLocator()
        const isVisible = await countLocator.isVisible()

        if (isVisible) {
            const count = await countLocator.textContent()
            this.correctAnswersCounts[bookmark] = count || '-'
        } else {
            this.correctAnswersCounts[bookmark] = '-'
        }

        // Answer and submit to progress
        await this.takeQuestionPage.selectAnswerNth(0)
        await this.takeQuestionPage.submit()
    }
})

Then('I see the correct answers count', async function (dataTable: DataTable) {
    const rows = dataTable.raw()
    for (const [bookmark, expected] of rows) {
        const actual = this.correctAnswersCounts[bookmark]
        expect(actual).toBe(expected)
    }
})
