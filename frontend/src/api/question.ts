import type { Question } from 'model/question.ts'
import { fetchJson, postJson, patchJson } from './helpers.ts'

export const fetchQuestion = async (questionId: string) => await fetchJson<Question>(`/api/question/${questionId}`)

export const fetchQuestionByEditId = async (editId: string) => await fetchJson<Question>(`/api/question/${editId}/edit`)

export type QuestionApiData = Omit<Question, 'id'>

export interface QuestionCreateResponse {
    readonly id: number
    readonly editId: string
}

export const saveQuestion = async (question: QuestionApiData) =>
    await postJson<QuestionApiData, QuestionCreateResponse>('/api/question', question)

export const updateQuestion = async (question: QuestionApiData, editId: string) =>
    await patchJson<QuestionApiData, number>(`/api/question/${editId}`, question)
