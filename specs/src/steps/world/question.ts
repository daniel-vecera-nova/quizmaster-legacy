export interface Answer {
    answer: string
    isCorrect: boolean
    explanation: string
}

export const emptyAnswer = (): Answer => ({ answer: '', isCorrect: false, explanation: '' })

export interface Question {
    url: string
    editUrl: string
    question: string
    answers: Answer[]
    explanation: string
}

export const emptyQuestion = (): Question => ({ url: '', editUrl: '', question: '', answers: [], explanation: '' })
