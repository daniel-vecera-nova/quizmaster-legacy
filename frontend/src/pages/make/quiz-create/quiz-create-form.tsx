import './quiz-create-form.scss'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useStateSet } from 'helpers'
import type { QuestionListItem } from 'model/question-list-item.ts'
import type { QuizCreateRequest } from 'api/quiz.ts'

import { Field, Form, NumberInput, RadioSet, Row, SubmitButton, TextArea, TextInput } from 'pages/components'
import { QuestionSelect } from './components/question-select.tsx'
import { ErrorMessage, createValidator } from 'pages/components/forms/validations.tsx'
import { validateQuizForm, errorMessage } from './validations.ts'
import type { QuizMode, Difficulty } from 'model/quiz.ts'

export type QuizCreateFormData = QuizCreateRequest

interface QuizCreateProps {
    readonly questions: readonly QuestionListItem[]
    readonly onSubmit: (data: QuizCreateFormData) => void
}

export const QuizCreateForm = ({ questions, onSubmit }: QuizCreateProps) => {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [selectedIds, toggleSelectedId] = useStateSet<number>()
    const [timeLimit, setTimeLimit] = useState<number>(600)
    const [finalCount, setFinalCount] = useState<number>(0)
    const [passScore, setPassScore] = useState<number>(80)
    const [filter, setFilter] = useState<string>('')
    const [searchParams] = useSearchParams()
    const [checkRandomize, setCheckRandomize] = useState(false)
    const [filteredQuestions, setFilteredQuestions] = useState<readonly QuestionListItem[]>(questions)
    const [feedbackMode, setFeedbackMode] = useState<QuizMode>('exam')
    const [difficulty, setDifficulty] = useState<Difficulty>('keep-question')

    const validator = createValidator(
        () => validateQuizForm({ title, description, timeLimit, passScore, selectedIds, finalCount }),
        errorMessage,
    )

    const toFormData = (): QuizCreateFormData => ({
        title,
        description,
        questionIds: Array.from(selectedIds),
        mode: feedbackMode,
        difficulty,
        passScore,
        timeLimit,
        workspaceGuid: searchParams.get('workspaceguid') || null,
        finalCount,
    })

    useEffect(() => {
        if (filter === '') {
            setFilteredQuestions(questions)
        } else {
            const filtered = questions.filter(q => q.question.toLowerCase().includes(filter.toLowerCase()))
            setFilteredQuestions(filtered)
        }
    }, [filter, questions])

    return (
        <Form id="create-quiz" validator={validator} onSubmit={() => onSubmit(toFormData())}>
            <Field label="Quiz title" required>
                <TextInput id="quiz-title" value={title} onChange={setTitle} />
                <ErrorMessage errorCode="empty-title" />
            </Field>
            <Field label="Quiz description">
                <TextArea id="quiz-description" value={description} onChange={setDescription} />
            </Field>
            <Row>
                <Field label="Pass score (in %)">
                    <NumberInput id="pass-score" value={passScore} onChange={setPassScore} />
                </Field>
                <Field label="Time limit (in sec)">
                    <NumberInput id="time-limit" value={timeLimit} onChange={setTimeLimit} />
                </Field>
            </Row>
            <Field label="Feedback mode">
                <RadioSet
                    name="mode"
                    value={feedbackMode}
                    onChange={setFeedbackMode}
                    options={{ exam: 'Exam', learn: 'Learning' }}
                />
            </Field>
            <Field label="Difficulty">
                <RadioSet
                    name="difficulty"
                    value={difficulty}
                    onChange={setDifficulty}
                    options={{ easy: 'Easy', hard: 'Hard', 'keep-question': 'Keep Question' }}
                />
            </Field>
            <div className="label">Select quiz questions</div>
            <Field label="Filter">
                <TextInput id="question-filter" value={filter} onChange={setFilter} />
            </Field>
            <QuestionSelect questions={filteredQuestions} onSelect={toggleSelectedId} />
            <ErrorMessage errorCode="few-questions" />

            <div style={{ paddingLeft: '25px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontWeight: 800 }} id="selected-question-count-for-quiz">
                        {selectedIds.size}
                    </div>
                    selected question(s)
                </span>
            </div>
            <div style={{ paddingLeft: '25px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontWeight: 800 }} id="total-question-count-for-quiz">
                        {questions.length}
                    </div>
                    total questions available
                </span>
            </div>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                    type="checkbox"
                    id="isRandomized"
                    onChange={e => setCheckRandomize(e.target.checked)}
                    checked={checkRandomize}
                />
                <label htmlFor="isRandomized" style={{ marginTop: '5px', fontWeight: 'bold' }}>
                    {' '}
                    Randomize questions in the quiz{' '}
                </label>
            </span>
            {checkRandomize && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '150px', paddingLeft: '25px' }}>
                        <NumberInput id="quiz-finalCount" value={finalCount} onChange={setFinalCount} />
                    </div>
                    random questions
                </span>
            )}
            <ErrorMessage errorCode="too-many-randomized-questions" />
            <SubmitButton />
        </Form>
    )
}
