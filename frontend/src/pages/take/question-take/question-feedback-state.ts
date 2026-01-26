import { type AnswerIdxs, isAnsweredCorrectly, type Answers } from 'model/question'
import type { QuestionTakeState } from 'pages/take/question-take'

export interface QuestionFeedbackState {
    readonly isAnswerCorrect: (idx: number) => boolean
    readonly showFeedback: (idx: number) => boolean
    readonly score: QuestionFeedbackScore
}
export interface QuestionFeedbackScore {
    readonly score: number
    readonly errorsCount: number
}

export const useQuestionFeedbackState = (state: QuestionTakeState, answers: Answers): QuestionFeedbackState => {
    const isQuestionCorrect = isAnsweredCorrectly(state.selectedAnswerIdxs, answers.correctAnswers)

    const isAnswerCorrect = (idx: number) =>
        (answers.correctAnswers.includes(idx) && state.selectedAnswerIdxs.includes(idx)) ||
        (!answers.correctAnswers.includes(idx) && !state.selectedAnswerIdxs.includes(idx))

    const showFeedback = (idx: number) => (state.isMultipleChoice ? true : state.selectedAnswerIdxs[0] === idx)

    const score = calculateScore(state.selectedAnswerIdxs, answers.correctAnswers, isQuestionCorrect)

    return { isAnswerCorrect, showFeedback, score }
}

export const calculateScore = (
    selectedAnswerIdxs: AnswerIdxs,
    correctAnswers: AnswerIdxs,
    isAnsweredCorrectly: boolean,
): QuestionFeedbackScore => {
    if (!selectedAnswerIdxs) {
        return { score: 0, errorsCount: correctAnswers.length }
    }
    const correctSelectedAnswers = selectedAnswerIdxs.filter(item => correctAnswers.includes(item))
    const wrongSelectedAnswers = selectedAnswerIdxs.filter(item => !correctAnswers.includes(item))
    const missingCorrectAnswers = correctAnswers.length - correctSelectedAnswers.length
    const totalErrorCount = wrongSelectedAnswers.length + missingCorrectAnswers

    if (isAnsweredCorrectly) {
        return { score: 1, errorsCount: totalErrorCount }
    }

    if (totalErrorCount <= 1) {
        return { score: 0.5, errorsCount: totalErrorCount }
    }

    return { score: 0, errorsCount: totalErrorCount }
}
