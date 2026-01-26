import { expect } from '@playwright/test'

import { Then } from 'steps/fixture.ts'

Then('I see the welcome page', async function () {
    expect(await this.quizWelcomePage.header()).toBe('Welcome to the quiz')
})

Then('I see quiz name {string}', async function (quizName: string) {
    expect(await this.quizWelcomePage.name()).toBe(quizName)
})

Then('I see quiz description {string}', async function (description: string) {
    expect(await this.quizWelcomePage.description()).toBe(description)
})

Then('I see question count {int}', async function (questionCount: number) {
    expect(await this.quizWelcomePage.questionCount()).toBe(questionCount)
})

Then('I see feedback type {string}', async function (feedbackType: string) {
    expect(await this.quizWelcomePage.feedback()).toBe(feedbackType)
})

Then('I see pass score {int} %', async function (passScore: number) {
    expect(await this.quizWelcomePage.passScore()).toBe(passScore)
})

Then('I see time limit set to {int} seconds', async function (timeLimit: number) {
    expect(await this.quizWelcomePage.timeLimit()).toBe(timeLimit)
})
