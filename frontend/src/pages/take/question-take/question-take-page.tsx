import './question-take-page.scss'

import { useState } from 'react'
import { useParams } from 'react-router-dom'

import type { Question } from 'model/question.ts'
import { useApi } from 'api/hooks'
import { fetchQuestion } from 'api/question.ts'
import { QuestionForm } from 'pages/take/question-take'

export const QuestionTakePage = () => {
    const params = useParams()

    const [question, setQuestion] = useState<Question | null>(null)

    useApi(params.id, fetchQuestion, setQuestion)

    return question ? <QuestionForm question={question} mode={'learn' as const} /> : null
}
