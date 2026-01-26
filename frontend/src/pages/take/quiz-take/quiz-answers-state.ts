import { useState } from 'react'

import { updated } from 'helpers'
import type { AnswerIdxs } from 'model/question.ts'

export type SelectedAnswers = readonly AnswerIdxs[]

export type QuizAnswers = {
    readonly firstAnswers: SelectedAnswers
    readonly finalAnswers: SelectedAnswers
}

export interface QuizAnswersState {
    readonly quizAnswers: QuizAnswers
    readonly answerQuestion: (questionIdx: number, answerIdxs: AnswerIdxs) => void
}

export const useQuizAnswersState = (): QuizAnswersState => {
    const [firstAnswers, setFirstAnswers] = useState<SelectedAnswers>([])
    const [finalAnswers, setFinalAnswers] = useState<SelectedAnswers>([])

    const answerQuestion = (questionIdx: number, answerIdxs: AnswerIdxs) => {
        if (firstAnswers[questionIdx] === undefined) setFirstAnswers(updated(firstAnswers, questionIdx, answerIdxs))

        setFinalAnswers(updated(finalAnswers, questionIdx, answerIdxs))
    }

    return { quizAnswers: { firstAnswers, finalAnswers }, answerQuestion }
}
