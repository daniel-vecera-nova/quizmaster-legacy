import { postJson, fetchJson } from './helpers.ts'
import type { Workspace } from 'model/workspace.ts'
import type { QuestionListItem } from 'model/question-list-item.ts'
import type { QuizListItem } from 'model/quiz-list-item.ts'

export type WorkspaceCreateRequest = {
    readonly title: string
}

export interface WorkspaceCreateResponse {
    readonly guid: string
}

export const postWorkspace = async (workspaceApiData: WorkspaceCreateRequest) =>
    await postJson<WorkspaceCreateRequest, WorkspaceCreateResponse>('/api/workspaces', workspaceApiData)

export const fetchWorkspace = async (guid: string) => await fetchJson<Workspace>(`/api/workspaces/${guid}`)

export const fetchWorkspaceQuestions = async (guid: string) =>
    await fetchJson<readonly QuestionListItem[]>(`/api/workspaces/${guid}/questions`)

export const fetchWorkspaceQuizzes = async (guid: string) =>
    await fetchJson<readonly QuizListItem[]>(`/api/workspaces/${guid}/quizzes`)
