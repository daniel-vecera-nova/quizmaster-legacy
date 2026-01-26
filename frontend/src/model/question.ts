export type AnswerIdxs = readonly number[]

export interface Question {
    readonly id: number
    readonly editId: string
    readonly question: string
    readonly answers: string[]
    readonly explanations: string[]
    readonly questionExplanation: string
    readonly correctAnswers: AnswerIdxs
    workspaceGuid: string | null
    easyMode: boolean
}

export interface Answers {
    readonly correctAnswers: AnswerIdxs
    readonly explanations: readonly string[]
    readonly questionExplanation: string
}

export const isAnsweredCorrectly = (selectedAnswerIdxs: AnswerIdxs, correctAnswers: AnswerIdxs): boolean => {
    if (selectedAnswerIdxs) {
        return (
            selectedAnswerIdxs.length === correctAnswers.length &&
            selectedAnswerIdxs.every(answerIndex => correctAnswers.includes(answerIndex))
        )
    }
    return false
}
