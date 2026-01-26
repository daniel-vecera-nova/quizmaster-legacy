import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { expectTextToBe, type TableOf } from 'steps/common.ts'
import { Given, Then } from 'steps/fixture.ts'
import type { AnswerRaw } from 'steps/question/ops.ts'
import { createQuestionInList, createWorkspace } from 'steps/workspace/ops.ts'

Given(/a quiz "(.+?)" with questions?/, async function (quizName: string, data: DataTable) {
    await createWorkspace(this, 'My List')

    for (const row of data.rows()) {
        const [question, answers] = row
        const answerRawTable = {
            raw: () =>
                answers.split(',').map(a => {
                    const [answer, correct] = a.trim().split(' ')
                    return [answer, correct === '(*)' ? '*' : '', '']
                }),
        } as TableOf<AnswerRaw>

        await createQuestionInList(this, question, answerRawTable)
    }

    await this.workspacePage.createNewQuiz()
    await this.quizCreatePage.enterQuizName(quizName)

    for (const [question] of data.rows()) {
        await this.quizCreatePage.selectQuestion(question)
    }

    await this.quizCreatePage.submit()
})

Given(/I take quiz "(.+?)" with answers?/, async function (quizName: string, data: DataTable) {
    await this.workspacePage.takeQuiz(quizName)
    await this.quizWelcomePage.start()
    const rows = Array.from(data.rows())
    for (let i = 0; i < rows.length; i++) {
        const [, answer] = rows[i]
        await this.takeQuestionPage.selectAnswer(answer)
        await this.questionPage.submit()
    }
    await this.questionPage.evaluate()
    await this.workspacePage.goto(this.workspaceCreatePage.workspaceGuid())
})

Then('I see stats page for quiz {string}', async function (quizName: string) {
    const statsPageHeaderElemenLocator = this.quizStatsPage.pageHeadingLocator()

    await expectTextToBe(statsPageHeaderElemenLocator, `Statistics for quiz: ${quizName}`)
})

Then('I see stats table', async function (data: DataTable) {
    const statsTableBodyRowsLocator = this.quizStatsPage.statsTableBodyRowsLocator()
    const actualRowCount = await statsTableBodyRowsLocator.count()

    const expectedRows = data.rows().filter(row => row.some(cell => cell.trim() !== ''))
    const expectedRowCount = expectedRows.length

    await expect(actualRowCount).toBe(expectedRowCount)

    for (let i = 0; i < expectedRows.length; i++) {
        const expectedRow = expectedRows[i]
        const actualRowLocator = statsTableBodyRowsLocator.nth(i)

        for (let j = 0; j < expectedRow.length; j++) {
            const expectedCell = expectedRow[j].trim()
            if (expectedCell !== '') {
                await expectTextToBe(actualRowLocator.locator('td').nth(j), expectedCell)
            }
        }
    }
})
