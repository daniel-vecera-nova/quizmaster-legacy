import { Button, Field, TextInput, Row, CheckField } from 'pages/components'
import type { AnswerState } from './question-form-state.ts'
import { ErrorMessage } from 'pages/components/forms/validations.tsx'
import DeleteAnswerButton from './delete-answer-button.tsx'

interface AnswerRowProps {
    readonly state: AnswerState
    readonly isMultipleChoice: boolean
    readonly showExplanations: boolean
    onDelete: () => void
    deleteDisabled: boolean
}

export const AnswerRow = ({ state, isMultipleChoice, onDelete, deleteDisabled, showExplanations }: AnswerRowProps) => (
    <div className="answer-row">
        <input
            type={isMultipleChoice ? 'checkbox' : 'radio'}
            checked={state.isCorrect}
            onChange={state.toggleCorrect}
        />
        <div>
            <TextInput placeholder="answer" className="text" value={state.answer} onChange={state.setAnswer} />
            {showExplanations && (
                <TextInput
                    placeholder="explanation"
                    className="explanation"
                    value={state.explanation}
                    onChange={state.setExplanation}
                />
            )}
        </div>
        <DeleteAnswerButton className="answer-delete-button" onClick={onDelete} disabled={deleteDisabled} />
    </div>
)

interface AnswersProps {
    readonly answerStates: readonly AnswerState[]
    readonly isMultipleChoice: boolean
    readonly addAnswer: () => void
    readonly showExplanations: boolean
    readonly setShowExplanations: (show: boolean | ((show: boolean) => boolean)) => void
    readonly removeAnswer: (idx: number) => void
}

export const AnswersEdit = ({
    answerStates,
    isMultipleChoice,
    addAnswer,
    showExplanations,
    setShowExplanations,
    removeAnswer,
}: AnswersProps) => {
    const handleToggleExplanations = () => setShowExplanations(showExplanations => !showExplanations)

    return (
        <Field label="Enter your answers" required>
            <CheckField
                id="show-explanation"
                label="Show explanations"
                onToggle={handleToggleExplanations}
                checked={showExplanations}
            />
            {answerStates.map((state, idx) => (
                <AnswerRow
                    state={state}
                    isMultipleChoice={isMultipleChoice}
                    onDelete={() => removeAnswer(idx)}
                    deleteDisabled={answerStates.length < 3}
                    showExplanations={showExplanations}
                />
            ))}
            <Row>
                <Button onClick={addAnswer} className="secondary button" id="add-answer">
                    Add Answer
                </Button>
            </Row>
            <ErrorMessage errorCode="no-correct-answer" />
            <ErrorMessage errorCode="empty-answer" />
            <ErrorMessage errorCode="empty-answer-explanation" />
            <ErrorMessage errorCode="few-correct-answers" />
        </Field>
    )
}
