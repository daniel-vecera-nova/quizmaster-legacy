import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from 'api/hooks'
import { fetchQuestionByEditId, type QuestionApiData, updateQuestion } from 'api/question.ts'

import { Page } from 'pages/components/page.tsx'
import { QuestionEditForm } from './form/question-form.tsx'
import { LoadedIndicator, QuestionEditLink, QuestionLink } from './components.tsx'
import type { Question } from 'model/question.ts'

export function EditQuestionPage() {
    const params = useParams()
    const questionEditId = params.id || ''

    const [question, setQuestion] = useState<Question | undefined>(undefined)

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [linkToQuestion, setLinkToQuestion] = useState<string>('')
    const [linkToEditQuestion, setLinkToEditQuestion] = useState<string>('')

    useApi(questionEditId, fetchQuestionByEditId, question => {
        setQuestion(question)
        setLinkToQuestion(`${location.origin}/question/${question.id}`)
        setLinkToEditQuestion(`${location.origin}/question/${questionEditId}/edit`)
        setIsLoaded(true)
    })
    const navigate = useNavigate()

    const handleSubmit = (questionData: QuestionApiData) => {
        updateQuestion(questionData, questionEditId).then(() => {
            navigate(`/workspace/${questionData.workspaceGuid}`)
        })
    }

    return (
        <Page title="Edit Question" id="edit-question-page">
            <QuestionEditForm key={question?.editId || ''} question={question} onSubmit={handleSubmit} />
            <QuestionLink url={linkToQuestion} />
            <QuestionEditLink editUrl={linkToEditQuestion} />
            <LoadedIndicator isLoaded={isLoaded} />
        </Page>
    )
}
