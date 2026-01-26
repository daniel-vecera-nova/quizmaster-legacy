import { isAnsweredCorrectly } from 'model/question.ts'
import type { Quiz } from 'model/quiz.ts'
import type { QuizAnswers } from './quiz-answers-state'
import { calculateScore } from '../question-take'

export interface QuizScore {
    readonly correct: number
    readonly firstCorrect: number
    readonly total: number
    readonly score: number
}

export const evaluate = (quiz: Quiz, quizAnswers: QuizAnswers): QuizScore => ({
    correct: quiz.questions.filter((question, idx) =>
        isAnsweredCorrectly(quizAnswers.finalAnswers[idx], question.correctAnswers),
    ).length,
    firstCorrect: quiz.questions.filter((question, idx) =>
        isAnsweredCorrectly(quizAnswers.firstAnswers[idx], question.correctAnswers),
    ).length,
    total: quiz.questions.length,
    score: quiz.questions
        .map(
            (question, idx) =>
                calculateScore(
                    quizAnswers.finalAnswers[idx],
                    question.correctAnswers,
                    isAnsweredCorrectly(quizAnswers.finalAnswers[idx], question.correctAnswers),
                ).score,
        )
        .reduce((a, b) => a + b, 0),
})
