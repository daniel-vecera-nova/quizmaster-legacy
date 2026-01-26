import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { Quiz } from 'model/quiz.ts'
import { useApi } from 'api/hooks.ts'
import { fetchQuiz } from 'api/quiz.ts'
import { QuizDetails } from './quiz-details.tsx'
import { putStats } from 'api/stats.ts'
import { getRandomRunId, setQuizRunId } from 'helpers.ts'

export const QuizWelcomePage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [quiz, setQuiz] = useState<Quiz>()

    useApi(params.id, fetchQuiz, setQuiz)

    const onStart = () => {
        const quizId = params.id
        navigate(`/quiz/${quizId}/questions`)
        sessionStorage.removeItem('quizAnswers')
        const quizRunId = getRandomRunId()
        putStats(String(quiz?.id), quizRunId, {
            started: new Date().toISOString(),
        })
        setQuizRunId(quizRunId)
    }

    return quiz && <QuizDetails quiz={quiz} onStart={onStart} />
}
