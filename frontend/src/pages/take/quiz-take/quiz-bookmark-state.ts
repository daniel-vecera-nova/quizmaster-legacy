import { useStateSet } from 'helpers.ts'

interface QuizBookmarkState {
    readonly questionIdxs: ReadonlySet<number>
    readonly has: (questionIdx: number) => boolean
    readonly toggle: (questionIdx: number) => void
    readonly remove: (questionIdx: number) => void
}

export const useQuizBookmarkState = (): QuizBookmarkState => {
    const [questionIdxs, toggle, , remove] = useStateSet<number>()

    const has = (questionIdx: number) => questionIdxs.has(questionIdx)

    return { questionIdxs, has, toggle, remove }
}
