import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { fetchWorkspaceQuestions } from 'api/workspace'
import { useWorkspaceGuid } from 'urls.ts'

import type { QuestionListItem } from 'model/question-list-item.ts'
import { postQuiz } from 'api/quiz'
import { QuizCreateForm, type QuizCreateFormData } from './quiz-create-form'
import { tryCatch } from 'helpers'
import { Alert, Page } from 'pages/components'
import { QuizUrl } from './components/quiz-url'

export const QuizCreatePage = () => {
    const workspaceGuid = useWorkspaceGuid()
    const navigate = useNavigate()

    const [workspaceQuestions, setWorkspaceQuestions] = useState<readonly QuestionListItem[]>([])
    const [quizId, setQuizId] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useApi(workspaceGuid, fetchWorkspaceQuestions, setWorkspaceQuestions)

    const onSubmit = (data: QuizCreateFormData) =>
        tryCatch(setErrorMessage, async () => {
            const quizId = await postQuiz(data)
            setQuizId(quizId)
            if (workspaceGuid) {
                navigate(`/workspace/${workspaceGuid}`)
            }
        })

    return (
        <Page title="Create Quiz" id="create-quiz-page">
            <QuizCreateForm questions={workspaceQuestions} onSubmit={onSubmit} />

            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
            {quizId && <QuizUrl quizId={quizId} />}
        </Page>
    )
}
