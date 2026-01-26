import type { Question } from 'model/question'

export interface WorkspaceData {
    readonly title: string
    readonly questions: readonly Question[]
}
