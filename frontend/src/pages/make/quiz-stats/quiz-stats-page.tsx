import { useState } from 'react'
import { useParams } from 'react-router-dom'

import type { Quiz } from 'model/quiz.ts'
import { useApi } from 'api/hooks.ts'
import { fetchQuiz } from 'api/quiz.ts'
import { QuizStats } from './quiz-stats-component.tsx'
import type { Stats } from 'model/stats.ts'
import { fetchStats } from 'api/stats.ts'

export const QuizStatsPage = () => {
    const params = useParams()
    const [quiz, setQuiz] = useState<Quiz>()
    const [stats, setStats] = useState<Stats>()

    useApi(params.id, fetchQuiz, setQuiz)
    useApi(params.id, fetchStats, setStats)

    return quiz && stats && <QuizStats quiz={quiz} stats={stats} />
}
