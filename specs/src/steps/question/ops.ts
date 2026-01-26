import type { TableOf } from 'steps/common.ts'
import { type Answer, emptyAnswer, emptyQuestion, type QuizmasterWorld } from 'steps/world'

export type AnswerRaw = [string, '*' | '', string]

// if change this value, also change in frontend/src/pages/create-question/create-question.tsx
const NUM_ANSWERS = 2

export const openCreatePage = async (world: QuizmasterWorld) => {
    await world.questionEditPage.gotoNew()
    world.questionWip = emptyQuestion()
}

export const openEditPage = async (world: QuizmasterWorld, bookmark: string) => {
    await world.questionEditPage.gotoEdit(world.questionBookmarks[bookmark].editUrl)
    world.activeQuestionBookmark = bookmark
}

export const enterQuestion = async (world: QuizmasterWorld, question: string) => {
    await world.questionEditPage.enterQuestion(question)
    world.questionWip.question = question
}

const enterPartialAnswer = async (world: QuizmasterWorld, index: number, answer: Partial<Answer>) => {
    const questionWip = world.questionWip
    const origAnswer = questionWip.answers[index] || emptyAnswer()
    questionWip.answers[index] = { ...origAnswer, ...answer }
}

export const enterAnswerText = async (world: QuizmasterWorld, index: number, answer: string) => {
    await world.questionEditPage.enterAnswerText(index, answer)
    enterPartialAnswer(world, index, { answer })
}

export const markAnswerCorrectness = async (world: QuizmasterWorld, index: number, isCorrect: boolean) => {
    await world.questionEditPage.setAnswerCorrectness(index, isCorrect)
    enterPartialAnswer(world, index, { isCorrect })
}

export const enterAnswerExplanation = async (world: QuizmasterWorld, index: number, explanation: string) => {
    await world.questionEditPage.enterAnswerExplanation(index, explanation)
    enterPartialAnswer(world, index, { explanation })
}

export const enterAnswer = async (
    world: QuizmasterWorld,
    index: number,
    answer: string,
    isCorrect: boolean,
    explanation: string,
) => {
    await world.questionEditPage.enterAnswer(index, answer, isCorrect, explanation)
    world.questionWip.answers[index] = { answer, isCorrect, explanation }
}

export const enterQuestionExplanation = async (world: QuizmasterWorld, explanation: string) => {
    await world.questionEditPage.enterQuestionExplanation(explanation)
    world.questionWip.explanation = explanation
}

export const markQuestionAsPartiallyScored = async (world: QuizmasterWorld) => {
    const newQuestion = `${world.questionWip.question} (Partial Score)`
    await world.questionEditPage.enterQuestion(newQuestion)
    world.questionWip.question = newQuestion
}

export async function submitQuestion(this: QuizmasterWorld) {
    await this.questionEditPage.submit()
}

export const saveQuestion = async (world: QuizmasterWorld, bookmark: string) => {
    await submitQuestion.bind(world)()
    world.questionWip.url = (await world.questionEditPage.questionUrl()) || ''
    world.questionWip.editUrl = (await world.questionEditPage.questionEditUrl()) || ''
    world.questionBookmarks[bookmark] = world.questionWip
}

export const addAnswers = async (world: QuizmasterWorld, answerRawTable: TableOf<AnswerRaw>) => {
    const editPage = world.questionEditPage
    const raw = answerRawTable.raw()

    const isMultipleChoice = raw.filter(([_, correct]) => correct === '*').length > 1
    if (isMultipleChoice) await editPage.setMultipleChoice()

    for (let i = 0; i < raw.length; i++) {
        if (i >= NUM_ANSWERS) await editPage.addAdditionalAnswer()
        const [answer, correct, explanation] = raw[i]
        const isCorrect = correct === '*'
        await enterAnswer(world, i, answer, isCorrect, explanation || '')
    }
}

export const createQuestion = async (
    world: QuizmasterWorld,
    bookmark: string,
    question: string,
    isEasy: boolean,
    answerRawTable: TableOf<AnswerRaw>,
    explanation?: string,
) => {
    await openCreatePage(world)
    await enterQuestion(world, question)
    await world.questionEditPage.checkShowExplanation()
    await addAnswers(world, answerRawTable)
    if (isEasy) {
        await world.questionEditPage.setEasyMode()
    }
    if (explanation) {
        await enterQuestionExplanation(world, explanation)
    }
    await saveQuestion(world, bookmark)
}
