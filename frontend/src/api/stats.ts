import type { Stats, StatsRecord } from 'model/stats.ts'
// import { fetchJson, putJson } from './helpers.ts'
// import { QuizCreateForm } from 'pages/make/quiz-create/quiz-create-form.tsx'

// export const fetchStats = async (quizId: number) => await fetchJson<Stats>(`/api/quiz/${quizId}/stats`)
// export const putStats = async (quizId: number, id: number, stats: Stats) => await putJson<Stats, string>(`/api/stats/${id}`, stats);
export const fetchStats = async (quizId: string): Promise<Stats> => {
    try {
        const item = sessionStorage.getItem(`stats-${quizId}`)
        if (!item) {
            return []
        }
        return JSON.parse(item) as Stats
    } catch (error) {
        return []
    }
}
export const putStats = async (quizId: string, id: number, stats: Partial<StatsRecord>) => {
    const quizStats = await fetchStats(quizId)

    const currentStat = quizStats.find(s => s.id === id)

    if (!currentStat) {
        sessionStorage.setItem(`stats-${quizId}`, JSON.stringify([...quizStats, { id, ...stats }]))
        return
    }

    const newStats = quizStats.map(s => (s.id === id ? { ...s, ...stats } : s))

    sessionStorage.setItem(`stats-${quizId}`, JSON.stringify(newStats))
}
