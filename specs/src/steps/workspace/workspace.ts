import { expect } from '@playwright/test'

import { expectTextToContain } from 'steps/common.ts'
import { Given, Then, When } from 'steps/fixture.ts'
import type { QuizmasterWorld } from 'steps/world'

const createWorkspace = async (world: QuizmasterWorld, title: string) => {
    await world.workspaceCreatePage.gotoNew()
    await world.workspaceCreatePage.enterWorkspaceName(title)
    await world.workspaceCreatePage.submit()
}

Given('I saved the workspace {string}', async function (workspaceTitle: string) {
    await createWorkspace(this, workspaceTitle)
})

Then('I see the {string} workspace page', async function (name: string) {
    expect(await this.workspacePage.workspaceNameValue()).toBe(name)
})

Then('I see an empty workspace', async function () {
    expect(await this.workspacePage.questionCount()).toBe(0)
})

Then('I see question in list {string}', async function (question: string) {
    await expectTextToContain(this.page.getByText(question), question)
})

Then('I see workspace title {string}', async function (title: string) {
    expect(await this.workspacePage.workspaceNameValue()).toBe(title)
})

When('I take question {string} from the list', async function (question: string) {
    this.activeQuestionBookmark = question
    await this.workspacePage.takeQuestion(question)
})

When('I edit question {string} from the list', async function (question: string) {
    this.activeQuestionBookmark = question
    await this.workspacePage.editQuestion(question)
})

Then(/I copy the (take|edit) question URL "(.+)" from the list/, async function (page: string, question: string) {
    this.activeQuestionBookmark = question

    if (page === 'take') await this.workspacePage.copyTakeQuestion(question)
    else if (page === 'edit') await this.workspacePage.copyEditQuestion(question)
})

Then('I see the quiz {string} in the workspace', async function (quizName: string) {
    await this.workspacePage.hasQuiz(quizName)
})

Then('I take quiz {string}', async function (quiz: string) {
    await this.workspacePage.takeQuiz(quiz)
})

Then('I click the stats button for quiz {string}', async function (quizName: string) {
    await this.workspacePage.statsQuiz(quizName)
})
