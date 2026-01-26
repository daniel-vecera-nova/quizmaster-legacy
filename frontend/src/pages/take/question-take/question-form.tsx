import './question-form.scss'
import type { AnswerIdxs, Question } from 'model/question.ts'
import React from 'react'
import {
    Answer,
    useQuestionFeedbackState,
    useQuestionTakeState,
    QuestionCorrectness,
    QuestionExplanation,
} from 'pages/take/question-take'
import { QuestionScore } from './components/question-score'
import type { QuizMode, Difficulty } from 'model/quiz.ts'
import { Form } from 'pages/components'

export interface QuestionFormProps {
    readonly question: Question
    readonly selectedAnswerIdxs?: AnswerIdxs
    readonly onSubmitted?: (selectedAnswerIdxs: AnswerIdxs) => void
    readonly onAnswerSelected?: (selectedAnswerIdxs: AnswerIdxs) => void
    readonly mode: QuizMode
    readonly quizDifficulty?: Difficulty
}

export const QuestionForm = (props: QuestionFormProps) => {
    const { correctAnswers, easyMode, answers, questionExplanation } = props.question

    const state = useQuestionTakeState(props)
    const feedback = useQuestionFeedbackState(state, props.question)

    // Notify parent when answers change
    React.useEffect(() => {
        props.onAnswerSelected?.(state.selectedAnswerIdxs)
    }, [state.selectedAnswerIdxs, props])

    const handleSubmit = () => {
        if (state.selectedAnswerIdxs.length > 0) {
            state.submit()
            props.onSubmitted?.(state.selectedAnswerIdxs)
        }
    }

    const isAnswerChecked = state.selectedAnswerIdxs.length > 0

    const correctAnswersCount = correctAnswers.length

    const shouldShowEasyMode =
        state.isMultipleChoice &&
        (props.quizDifficulty
            ? props.quizDifficulty === 'easy'
                ? true
                : props.quizDifficulty === 'hard'
                  ? false
                  : easyMode
            : easyMode)

    return (
        <Form onSubmit={handleSubmit} id="question-form">
            <fieldset className="question-fieldset" name={`question-${props.question.id}`}>
                <legend>
                    <h1 id="question">{props.question.question}</h1>
                </legend>

                {shouldShowEasyMode && (
                    <div>
                        Correct answers count is{' '}
                        <strong className="correct-answers-count">{correctAnswersCount}</strong>
                    </div>
                )}

                <ul className="answers">
                    {answers.map((answer, idx) => (
                        <Answer
                            key={answer}
                            isMultipleChoice={state.isMultipleChoice}
                            idx={idx}
                            questionId={props.question.id}
                            answer={answer}
                            isCorrect={correctAnswers.includes(idx)}
                            explanation={props.question.explanations ? props.question.explanations[idx] : 'not defined'}
                            showFeedback={state.submitted && feedback.showFeedback(idx) && props.mode === 'learn'}
                            onAnswerChange={state.onSelectedAnswerChange}
                            isAnswerChecked={state.isAnswerChecked}
                        />
                    ))}
                </ul>

                {!state.submitted && (
                    <input type="submit" value="Submit" className="submit-btn" disabled={!isAnswerChecked} />
                )}
                {state.submitted && props.mode === 'learn' && (
                    <>
                        <QuestionCorrectness
                            score={feedback.score.score}
                            errorCount={feedback.score.errorsCount}
                            isPartialCorrectnessEnabled={props.question.question.includes('(Partial Score)')}
                        />
                        <QuestionScore score={feedback.score.score} />
                        <QuestionExplanation text={questionExplanation} />
                    </>
                )}
            </fieldset>
        </Form>
    )
}
