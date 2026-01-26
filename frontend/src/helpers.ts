import { useState, type SyntheticEvent } from 'react'

export const tryCatch = async <T>(setErrorMessage: (message: string) => void, fn: () => Promise<T>): Promise<T> => {
    setErrorMessage('')
    try {
        return await fn()
    } catch (error) {
        setErrorMessage('Unexpected Error')
        throw error
    }
}

type Handler<E extends SyntheticEvent> = (e: E) => void

export const preventDefault =
    <E extends SyntheticEvent>(handle: Handler<E>): Handler<E> =>
    (e: E): void => {
        e.preventDefault()
        handle(e)
    }

type AlterValue<T> = (value: T) => void
type StateSet<T> = [ReadonlySet<T>, AlterValue<T>, AlterValue<T>, AlterValue<T>]

export const useStateSet = <T>(): StateSet<T> => {
    const [value, setValue] = useState<ReadonlySet<T>>(new Set())

    const withValue = (value: T) => (prev: ReadonlySet<T>) => new Set([...prev, value])
    const withoutValue = (value: T) => (prev: ReadonlySet<T>) => new Set([...prev].filter(v => v !== value))

    const addValue = (value: T) => setValue(withValue(value))
    const removeValue = (value: T) => setValue(withoutValue(value))

    const toggleValue = (value: T) =>
        setValue(prev => (prev.has(value) ? withoutValue(value)(prev) : withValue(value)(prev)))

    return [value, toggleValue, addValue, removeValue]
}

export const updated = <T>(answers: readonly T[], questionIdx: number, answerIdxs: T): readonly T[] => {
    const newAnswers = Array.from(answers)
    newAnswers[questionIdx] = answerIdxs
    return newAnswers
}

export const getRandomRunId = (): number => Math.floor(Math.random() * 1000000000)
export const setQuizRunId = (runId: number) => sessionStorage.setItem('quizRunId', runId.toString())
export const getQuizRunId = (): number => {
    if (sessionStorage.getItem('quizRunId')) {
        return Number.parseInt(sessionStorage.getItem('quizRunId') ?? '0')
    }

    const runId = getRandomRunId()
    setQuizRunId(runId)
    return runId
}
