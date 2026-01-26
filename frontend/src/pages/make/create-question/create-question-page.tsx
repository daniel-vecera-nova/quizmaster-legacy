import './create-question.scss'
import { useNavigate } from 'react-router-dom'
import { type QuestionApiData, saveQuestion } from 'api/question.ts'

import { Page } from 'pages/components/page.tsx'
import { QuestionEditForm } from './form/question-form.tsx'
import { useWorkspaceGuid } from 'urls.ts'

export function CreateQuestionPage() {
    const workspaceGuid = useWorkspaceGuid()
    const navigate = useNavigate()

    const handleSubmit = (questionData: QuestionApiData) => {
        const apiData = { ...questionData, workspaceGuid: workspaceGuid || null }
        saveQuestion(apiData).then(response => {
            const url = workspaceGuid !== '' ? `/workspace/${workspaceGuid}` : `/question/${response.editId}/edit`
            navigate(url)
        })
    }

    return (
        <Page title="Create Question" id="create-question-page">
            <QuestionEditForm onSubmit={handleSubmit} />
        </Page>
    )
}
