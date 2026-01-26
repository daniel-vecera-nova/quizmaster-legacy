import { useStateSet } from 'helpers'
import type { Quiz } from 'model/quiz.ts'
import { useNavigate, useParams } from 'react-router-dom'

export interface QuizNavigationState {
    readonly currentQuestionIdx: number
    readonly isFirstQuestion: boolean
    readonly isLastQuestion: boolean
    readonly skippedQuestions: ReadonlySet<number>
    readonly goto: (questionIdx: number) => void
    readonly canBack: boolean
    readonly canNext: boolean
    readonly canSkip: boolean
    readonly next: () => void
    readonly back: () => void
    readonly skip: () => void
    readonly unskip: () => void
}

export const useQuizNavigationState = (quiz: Quiz): QuizNavigationState => {
    const { questionId } = useParams()

    const navigate = useNavigate()

    const currentQuestionIdx = !questionId ? 0 : Number(questionId)

    const [skippedQuestions, , addSkippedQuestion, removeSkippedQuestion] = useStateSet<number>()

    const isFirstQuestion = currentQuestionIdx === 0
    const isLastQuestion = currentQuestionIdx === quiz.questions.length - 1

    const next = () => {
        if (isLastQuestion) {
            navigate(`/quiz/${quiz.id}/questions`)
        } else {
            navigate(`/quiz/${quiz.id}/questions/${currentQuestionIdx + 1}`)
        }
    }

    const canNext = !isLastQuestion || skippedQuestions.size > 0
    const canSkip = !isLastQuestion

    const skip = () => {
        addSkippedQuestion(currentQuestionIdx)
        next()
    }

    const unskip = () => {
        removeSkippedQuestion(currentQuestionIdx)
    }

    const canBack = currentQuestionIdx > 0

    const back = () => navigate(`/quiz/${quiz.id}/questions/${currentQuestionIdx - 1}`)

    return {
        currentQuestionIdx,
        isFirstQuestion,
        isLastQuestion,
        skippedQuestions,
        goto: (questionIdx: number) => navigate(`/quiz/${quiz.id}/questions/${questionIdx}`),
        canNext,
        canSkip,
        canBack,
        next,
        back,
        skip,
        unskip,
    }
}
