export type QuizMode = 'learn' | 'exam'
export type Difficulty = 'easy' | 'hard' | 'keep-question'

export interface Quiz {
    title: string
    description: string
    questionIds: number[]
    mode: QuizMode
    passScore: number
    timeLimit: number
    size?: number
    difficulty?: Difficulty
}

export interface QuizBookmark extends Quiz {
    url: string
}

export const emptyQuiz = (): Quiz => ({
    title: '',
    description: '',
    questionIds: [],
    mode: 'exam',
    passScore: 0,
    timeLimit: 120,
})
export const emptyQuizBookmark = (): QuizBookmark => ({
    url: '',
    title: '',
    description: '',
    questionIds: [],
    mode: 'exam',
    passScore: 0,
    timeLimit: 120,
})
