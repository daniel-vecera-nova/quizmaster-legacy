import type { TableOf } from 'steps/common.ts'
import { addAnswers, type AnswerRaw, enterQuestion } from 'steps/question/ops.ts'
import { emptyQuestion, type QuizmasterWorld } from 'steps/world'

export const openCreateWorkspacePage = async (world: QuizmasterWorld) => {
    world.workspaceCreatePage.gotoNew()
}

export const createWorkspace = async (world: QuizmasterWorld, name: string) => {
    await openCreateWorkspacePage(world)
    await world.workspaceCreatePage.enterWorkspaceName(name)
    await world.workspaceCreatePage.submit()
}

export const createQuestionInList = async (
    world: QuizmasterWorld,
    question: string,
    answerRawTable: TableOf<AnswerRaw>,
) => {
    await world.workspacePage.createNewQuestion()
    world.questionWip = emptyQuestion()
    await enterQuestion(world, question)
    await world.questionEditPage.checkShowExplanation()
    await addAnswers(world, answerRawTable)
    world.questionBookmarks[question] = world.questionWip
    await world.questionEditPage.submit()
}
