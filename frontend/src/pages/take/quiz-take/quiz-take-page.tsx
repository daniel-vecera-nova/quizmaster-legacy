import { useState, useEffect } from 'react'

import { useQuizApi } from './hooks.ts'

import { QuizScorePage } from './quiz-score-page.tsx'
import { QuestionForm } from './quiz.tsx'
import type { QuizAnswers } from './quiz-answers-state.ts'
import { useNavigate } from 'react-router-dom'
import { putStats } from 'api/stats.ts'
import { getQuizRunId } from 'helpers.ts'
import { evaluate } from './quiz-score.ts'

export const QuizTakePage = () => {
    const quiz = useQuizApi()
    const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const stored = sessionStorage.getItem('quizAnswers')
        if (stored) {
            setQuizAnswers(JSON.parse(stored))
        }
    }, [])

    function updateSessionStorage(answers: QuizAnswers | null) {
        if (answers !== null) {
            sessionStorage.setItem('quizAnswers', JSON.stringify(answers))
        } else {
            sessionStorage.removeItem('quizAnswers')
        }
    }
    function handleEvaluate(answers: QuizAnswers | null) {
        navigate(`/quiz/${quiz?.id}/questions`)
        updateSessionStorage(answers)
        setQuizAnswers(answers)

        const score =
            quiz && answers ? Math.round((evaluate(quiz, answers).score / evaluate(quiz, answers).total) * 100) : 0
        putStats(String(quiz?.id), getQuizRunId(), {
            finished: new Date().toISOString(),
            score,
        })
    }

    if (quiz) {
        return quizAnswers ? (
            <QuizScorePage quiz={quiz} quizAnswers={quizAnswers} />
        ) : (
            <QuestionForm quiz={quiz} onEvaluate={handleEvaluate} />
        )
    }
}
