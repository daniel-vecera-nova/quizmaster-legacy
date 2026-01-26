import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { Given, Then } from 'steps/fixture.ts'
import { type QuizmasterWorld, type Quiz, type QuizMode, type Difficulty, type Question, parseKey } from 'steps/world'
import { createQuestion } from 'steps/question/ops.ts'

const postQuiz = async (world: QuizmasterWorld, bookmark: string, quiz: Quiz) => {
    const questionIds = quiz.questionIds

    const quizPayload = {
        title: quiz.title,
        description: quiz.description,
        questionIds,
        mode: quiz.mode,
        passScore: quiz.passScore,
        timeLimit: quiz.timeLimit,
        size: quiz.size,
        difficulty: quiz.difficulty,
    }

    const response = await world.page.request.post('/api/quiz', { data: quizPayload })
    const quizId = await response.json()
    const quizUrl = `/quiz/${quizId}`

    world.quizBookmarks[bookmark] = { url: quizUrl, ...quiz }
    world.activeQuizBookmark = bookmark
}

const validateQuizRow = (questionBookmarks: Record<string, Question>, row: Record<string, string>) => {
    const hasBookmark = row.bookmark !== ''
    const hasValidMode = !row.mode || row.mode === 'exam' || row.mode === 'learn'

    const hasValidQuestions =
        !Number.isNaN(Number.parseInt(row.questions)) ||
        parseKey(row.questions).every(bookmark => questionBookmarks[bookmark] !== undefined)

    return hasBookmark && hasValidMode && hasValidQuestions
}

const createDummyQuestion = async (world: QuizmasterWorld, bookmark: string) => {
    await createQuestion(world, bookmark, '1 + 1 = ?', false, {
        raw: () => [
            ['2', '*', ''],
            ['3', '', ''],
        ],
    })
}

const toDifficulty = (difficulty: string): Difficulty | undefined => {
    const mapping: Record<string, Difficulty> = {
        'Keep Question': 'keep-question',
        Easy: 'easy',
        Hard: 'hard',
    }
    return mapping[difficulty]
}

const createDummyQuestions = async (world: QuizmasterWorld, quizBookmark: string, count: number) => {
    const questionBookmarks = Array.from({ length: count }, (_, i) => `${quizBookmark} ${i}`)

    for (const bookmark of questionBookmarks) {
        await createDummyQuestion(world, bookmark)
    }

    return questionBookmarks
}

const toQuiz = async (world: QuizmasterWorld, row: Record<string, string>): Promise<Quiz> => {
    if (!validateQuizRow(world.questionBookmarks, row))
        throw new Error(`Invalid quiz row: ${JSON.stringify(row, null, 2)}`)

    const dummyQuestions = Number.parseInt(row.questions)

    const questionBookmarks = Number.isNaN(dummyQuestions)
        ? parseKey(row.questions)
        : await createDummyQuestions(world, row.bookmark, dummyQuestions)

    return {
        title: row.title || row.bookmark,
        description: row.description || row.bookmark,
        questionIds: questionBookmarks
            .map(bookmark => world.questionBookmarks[bookmark])
            .map(question => Number.parseInt(question.url.split('/').pop() || '0')),
        mode: (row.mode || 'exam') as QuizMode,
        passScore: Number.parseInt(row['pass score']) || 50,
        timeLimit: Number.parseInt(row['time limit']) || 120,
        size: Number.parseInt(row.size) || undefined,
        difficulty: toDifficulty(row.difficulty),
    }
}

Given(
    /a quiz "([^"]+)" with (\d+) questions, (exam|learn) mode and (\d+)% pass score/,
    async function (bookmark: string, questions: number, mode: QuizMode, passScore: number) {
        const quiz = await toQuiz(this, {
            bookmark,
            questions: questions.toString(),
            mode,
            'pass score': passScore.toString(),
            timeLimit: '120',
        })

        await postQuiz(this, bookmark, quiz)
    },
)

Given('quizes', async function (data: DataTable) {
    for (const row of data.hashes()) {
        await postQuiz(this, row.bookmark, await toQuiz(this, row))
    }
})

Then('I see selected question count {int}', async function (expectedCount: number) {
    const actualCount = await this.quizCreatePage.selectedQuestionCountForQuiz()
    expect(Number.parseInt(actualCount || '0')).toBe(expectedCount)
})

Then('I see total question count {int}', async function (expectedCount: number) {
    const actualCount = await this.quizCreatePage.totalQuestionCountForQuiz()
    expect(Number.parseInt(actualCount || '0')).toBe(expectedCount)
})
