import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { fetchQuiz } from 'api/quiz'
import type { Quiz } from 'model/quiz.ts'

export const useQuizApi = () => {
    const params = useParams()
    const quizId = params.id

    const [quiz, setQuiz] = useState<Quiz>()
    useApi(quizId, fetchQuiz, setQuiz)

    return quiz
}
