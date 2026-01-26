import { fail } from 'node:assert'
import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { expectedNumberOfChildrenToBe } from 'steps/common.ts'
import { Then, When } from 'steps/fixture.ts'
import type { QuizMode, Difficulty } from 'steps/world/quiz.ts'

When('I start creating a new quiz', async function () {
    await this.workspacePage.createNewQuiz()
})

When('I enter quiz name {string}', async function (title: string) {
    await this.quizCreatePage.enterQuizName(title)
})

When('I enter number of randomized questions in quiz {int}', async function (finalCount: string) {
    await this.quizCreatePage.enterQuizFinalCount(finalCount)
})

When('I see empty quiz title', async function () {
    await this.quizCreatePage.getQuizTitleValue().then(value => expect(value).toBe(''))
})

When('I see empty quiz description', async function () {
    await this.quizCreatePage.getQuizDescriptionValue().then(value => expect(value).toBe(''))
})

When('I see time limit {string} seconds', async function (timeLimit: string) {
    await this.quizCreatePage
        .timeLimitInput()
        .inputValue()
        .then(value => expect(value).toBe(timeLimit))
})

When('I see pass score {string}', async function (score: string) {
    await this.quizCreatePage
        .passScoreInput()
        .inputValue()
        .then(value => expect(value).toBe(score))
})

When('I see quiz question {string}', async function (title: string) {
    await this.quizCreatePage
        .getQuestion(title)
        .first()
        .isVisible()
        .then(visible => expect(visible).toEqual(true))
})

When("I don't see quiz questions {string}", async function (title: string) {
    await this.quizCreatePage
        .getQuestion(title)
        .first()
        .isVisible()
        .then(visible => expect(visible).toEqual(false))
})

When('I enter quiz description {string}', async function (title: string) {
    await this.quizCreatePage.enterDescription(title)
})

When('I select question {string}', async function (question: string) {
    await this.quizCreatePage.selectQuestion(question)
})

When('I check randomized function', async function () {
    await this.quizCreatePage.selectRandomizedFunction()
})

When(/I select (exam|learn) mode/, async function (mode: QuizMode) {
    await this.quizCreatePage.selectFeedbackMode(mode)
})

When('I select difficulty {string}', async function (inputDifficulty: string) {
    const difficulty = inputDifficulty.toLowerCase().replace('_', '-') as Difficulty
    await this.quizCreatePage.selectDifficulty(difficulty)
})

When('I submit the quiz', async function () {
    await this.quizCreatePage.submit()
})

When('I enter pass score {string}', async function (score: string) {
    await this.quizCreatePage.passScoreInput().fill(score)
})

When('I enter time limit {string}', async function (limit: string) {
    await this.quizCreatePage.timeLimitInput().fill(limit)
})

When('I filter questions by {string}', async function (s: string) {
    await this.quizCreatePage.enterFilterString(s)
})

Then('I see workspace with {int} available questions', async function (count: number) {
    await expectedNumberOfChildrenToBe(this.quizCreatePage.questionsInList(), count)
})

Then('I clear time limit', async function () {
    await this.quizCreatePage.clearTimeLimit()
})

Then('I clear score', async function () {
    await this.quizCreatePage.clearScore()
})

Then('I see error messages in quiz form', async function (table: DataTable) {
    const expectedErrors = table.raw().map(row => row[0])
    for (const error of expectedErrors) {
        const hasError = await this.quizCreatePage.hasError(error)
        expect(hasError).toBe(true)
    }
})

Then('I see no error messages in quiz form', async function () {
    await this.quizCreatePage.hasAnyError().then(result => expect(result).toBe(false))
})

Then("I don't see questions in quiz creation form", () => {
    fail('Not implemented yet')
})

Then('I see questions in quiz creation form', () => {
    fail('Not implemented yet')
})
