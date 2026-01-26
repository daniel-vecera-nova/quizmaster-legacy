import { fetchJson, postJson, putJson } from './helpers.ts'
import type { Quiz, QuizMode, Difficulty } from 'model/quiz.ts'

export interface QuizCreateRequest {
    readonly title: string
    readonly description: string
    readonly questionIds: readonly number[]
    readonly mode: QuizMode
    readonly difficulty?: Difficulty
    readonly passScore: number
    readonly timeLimit: number
    readonly size?: number
    readonly workspaceGuid: string | null
    readonly finalCount?: number
}

export const fetchQuiz = async (quizId: string) => await fetchJson<Quiz>(`/api/quiz/${quizId}`)

export const putQuiz = async (quiz: Quiz, id: string) => await putJson<Quiz, string>(`/api/quiz/${id}`, quiz)

export const postQuiz = async (quiz: QuizCreateRequest) => await postJson<QuizCreateRequest, string>('/api/quiz', quiz)
