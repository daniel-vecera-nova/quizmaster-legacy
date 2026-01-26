import type { AnswerIdxs } from 'model/question'
import type { Quiz } from 'model/quiz.ts'
import { QuestionForm as StandaloneQuestionForm } from '../question-take/index.ts'
import { ProgressBar } from './components/progress-bar.tsx'
import { EvaluateButton, NextButton, BackButton, BookmarkButton } from './components/buttons.tsx'
import { useState } from 'react'

import { BookmarkList } from './components/bookmark-list.tsx'
import { TimeLimit } from './time-limit/with-time-limit.tsx'
import { useQuizAnswersState, type QuizAnswers } from './quiz-answers-state.ts'
import { updated } from 'helpers'
import { useQuizNavigationState } from './quiz-navigation-state.ts'
import { useQuizBookmarkState } from './quiz-bookmark-state.ts'

interface QuestionProps {
    readonly quiz: Quiz
    readonly onEvaluate: (quizAnswers: QuizAnswers) => void
}

export type QuizState = readonly AnswerIdxs[]

export const QuestionForm = (props: QuestionProps) => {
    const { quizAnswers, answerQuestion } = useQuizAnswersState()
    const nav = useQuizNavigationState(props.quiz)
    const bookmarks = useQuizBookmarkState()
    const [selectedAnswers, setSelectedAnswers] = useState<AnswerIdxs | undefined>(undefined)

    const answer = (selectedAnswerIdxs: AnswerIdxs) => {
        answerQuestion(nav.currentQuestionIdx, selectedAnswerIdxs)
        nav.unskip()
    }

    const answerAndNext = (selectedAnswerIdxs: AnswerIdxs) => {
        answer(selectedAnswerIdxs)
        if (!nav.isLastQuestion) {
            nav.next()
        }
    }

    const bookmark = () => bookmarks.toggle(nav.currentQuestionIdx)

    // Prepare bookmarks for BookmarkList
    const bookmarkList = Array.from(bookmarks.questionIdxs).map(questionIdx => ({
        title: props.quiz.questions[questionIdx].question,
        onClick: () => nav.goto(questionIdx),
        onDelete: () => bookmarks.remove(questionIdx),
    }))

    const evaluate = () => {
        props.onEvaluate(quizAnswers)
    }

    const currentQuestion = props.quiz.questions[nav.currentQuestionIdx]
    const currentAnswers = quizAnswers.finalAnswers[nav.currentQuestionIdx]
    const isAnswered = currentAnswers !== undefined
    const hasSelectedAnswer = selectedAnswers !== undefined && selectedAnswers.length > 0

    // Funkce pro Next button - dělá skip/submit/next/evaluate
    const handleNextButton = () => {
        console.log('Handling Next button click:', selectedAnswers, hasSelectedAnswer)
        if (!hasSelectedAnswer) {
            // Pokud není zodpovězeno, skipni a bookmarkuj
            if (!bookmarks.has(nav.currentQuestionIdx)) {
                bookmarks.toggle(nav.currentQuestionIdx)
            }
            nav.skip()
        } else {
            // Pokud je zodpovězeno, submitni odpověď
            answer(selectedAnswers)
            // Sestavíme aktualizovaný objekt QuizAnswers (react state update je asynchronní)
            const updatedQuizAnswers: QuizAnswers = {
                firstAnswers: quizAnswers.firstAnswers,
                finalAnswers: updated(quizAnswers.finalAnswers, nav.currentQuestionIdx, selectedAnswers),
            }

            // Pokud po odeslání budou zodpovězeny všechny otázky, přejdeme na vyhodnocení,
            // jinak pokračujeme na další otázku
            const allAnswered = props.quiz.questions.every(
                (_, idx) => updatedQuizAnswers.finalAnswers[idx] !== undefined,
            )

            if (allAnswered) {
                props.onEvaluate(updatedQuizAnswers)
            } else {
                nav.next()
            }
        }
    }

    const handleAnswerSubmitted = (answers: AnswerIdxs) => {
        setSelectedAnswers(answers)
        if (props.quiz.mode === 'learn') {
            answer(answers)
        } else {
            answerAndNext(answers)
        }
    }

    return (
        <div>
            <TimeLimit timeLimit={props.quiz.timeLimit} onConfirm={evaluate} />
            <h2>Quiz</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div id="feedback-mode">Feedback mode:</div>
                <label style={{ fontWeight: 800 }}>{props.quiz.mode}</label>
            </div>

            <ProgressBar current={nav.currentQuestionIdx + 1} total={props.quiz.questions.length} />

            <StandaloneQuestionForm
                key={currentQuestion.id}
                question={currentQuestion}
                selectedAnswerIdxs={quizAnswers.finalAnswers[nav.currentQuestionIdx]}
                onAnswerSelected={answers => {
                    setSelectedAnswers(answers)
                }}
                onSubmitted={handleAnswerSubmitted}
                mode={props.quiz.mode}
                quizDifficulty={props.quiz.difficulty}
            />
            <div
                style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', marginBottom: '20px' }}
            >
                {nav.canBack && <BackButton onClick={nav.back} />}
                {nav.canNext && <NextButton onClick={handleNextButton} />}
                {isAnswered && !nav.canNext && <EvaluateButton onClick={evaluate} />}
                <BookmarkButton isBookmarked={bookmarks.has(nav.currentQuestionIdx)} onClick={bookmark} />
            </div>

            {/* Bookmark list visible for tests */}
            <BookmarkList bookmarks={bookmarkList} />
        </div>
    )
}
