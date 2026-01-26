import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import type { TableOf } from 'steps/common.ts'
import { Given, When, Then } from 'steps/fixture.ts'
import type { AnswerRaw } from 'steps/question/ops.ts'
import { createQuestionInList, createWorkspace, openCreateWorkspacePage } from 'steps/workspace/ops.ts'

Given('I start creating a workspace', async function () {
    await openCreateWorkspacePage(this)
})

Given(/a workspace with questions?/, async function (data: DataTable) {
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
})

When('I enter workspace name {string}', async function (name: string) {
    await this.workspaceCreatePage.enterWorkspaceName(name)
})

When('I submit the workspace', async function () {
    await this.workspaceCreatePage.submit()
})

Then('I see an error message on workspace page stating title must be mandatory', async function () {
    const errorMessage = await this.workspaceCreatePage.errorMessage()
    expect(errorMessage).not.toBe('')
})
