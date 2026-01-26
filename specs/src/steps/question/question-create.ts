import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import type { TableOf } from 'steps/common.ts'
import { Given, When, Then } from 'steps/fixture.ts'
import {
    addAnswers,
    createQuestion,
    enterQuestion,
    openCreatePage,
    saveQuestion,
    type AnswerRaw,
} from 'steps/question/ops.ts'

Given('a question {string}', async function (question: string) {
    await openCreatePage(this)
    await this.questionEditPage.checkShowExplanation()
    await enterQuestion(this, question)
})

Given(
    'a question {string} bookmarked as {string}',
    async function (question: string, bookmark: string, answerRawTable: TableOf<AnswerRaw>) {
        await createQuestion(this, bookmark, question, false, answerRawTable)
    },
)

Given('questions', async function (data: DataTable) {
    for (const row of data.hashes()) {
        const { bookmark, question, answers, easy, explanation } = row
        const isEasy = easy === 'true'
        const answerRawTable = {
            raw: () =>
                answers.split(',').map(a => {
                    const [answer, correct] = a.trim().split(' ')
                    return [answer, correct === '(*)' ? '*' : '', '']
                }),
        } as TableOf<AnswerRaw>

        await createQuestion(this, bookmark, question, isEasy, answerRawTable, explanation)
    }
})

Given('with answers:', async function (answerRawTable: TableOf<AnswerRaw>) {
    await addAnswers(this, answerRawTable)
})

Given('with explanation {string}', async function (explanation: string) {
    await this.questionEditPage.enterQuestionExplanation(explanation)
    this.questionWip.explanation = explanation
})

Given('marked as easy mode', async function () {
    await this.questionEditPage.setEasyMode()
})

Given('saved and bookmarked as {string}', async function (bookmark) {
    await saveQuestion(this, bookmark)
})

When('I wait for {int} ms', async (milliseconds: number) => {
    await new Promise(resolve => setTimeout(resolve, milliseconds))
})

When('I check "Add explanation to your answer" checkbox', async function () {
    await this.questionEditPage.checkShowExplanationFields()
})

When('I check "Show explanation" checkbox', async function () {
    await this.questionEditPage.checkShowExplanation()
})

When('I uncheck "Show explanation" checkbox', async function () {
    await this.questionEditPage.uncheckShowExplanation()
})

Then('I see explanation fields are visible for answers', async function () {
    const countExplanationFields = await this.questionEditPage.countExplanationFields()
    expect(countExplanationFields).toBe(2)
})
