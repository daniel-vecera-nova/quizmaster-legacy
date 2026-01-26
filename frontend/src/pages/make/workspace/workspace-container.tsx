import './workspace.scss'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { fetchWorkspace, fetchWorkspaceQuestions, fetchWorkspaceQuizzes } from 'api/workspace'
import type { QuestionListItem } from 'model/question-list-item'
import type { QuizListItem } from 'model/quiz-list-item'
import type { Workspace } from 'model/workspace'
import { WorkspaceComponent } from './workspace'

export function WorkspaceContainer() {
    const params = useParams()

    const [workspaceInfo, setWorkspaceInfo] = useState<Workspace>({ guid: params.id || '', title: '' })
    const [workspaceQuestions, setWorkspaceQuestions] = useState<readonly QuestionListItem[]>([])
    const [workspaceQuizzes, setWorkspaceQuizzes] = useState<readonly QuizListItem[]>([])

    useApi(params.id, fetchWorkspace, setWorkspaceInfo)
    useApi(params.id, fetchWorkspaceQuestions, setWorkspaceQuestions)
    useApi(params.id, fetchWorkspaceQuizzes, setWorkspaceQuizzes)

    return <WorkspaceComponent workspace={workspaceInfo} questions={workspaceQuestions} quizzes={workspaceQuizzes} />
}
