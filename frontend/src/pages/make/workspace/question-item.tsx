import type { QuestionListItem } from 'model/question-list-item'
import { EditQuestionButton, TakeQuestionButton, CopyQuestionButton } from './workspace.tsx'

interface Props {
    question: QuestionListItem
    index?: number
    onEditQuestion: () => void
    onCopyEditQuestion: () => void
    onTakeQuestion: () => void
    onCopyTakeQuestion: () => void
}

export const QuestionItem: React.FC<Props> = ({
    question,
    index,
    onEditQuestion,
    onCopyEditQuestion,
    onTakeQuestion,
    onCopyTakeQuestion,
}) => {
    return (
        <div className="question-item">
            {index !== undefined && <span className="question-index">Q{index + 1}. </span>}
            <span id="question-text">{question.question}</span>
            <div className="edit-button">
                <EditQuestionButton id={question.editId} editId={question.editId} onClick={onEditQuestion} />
            </div>
            <div className="copy-edit-button">
                <CopyQuestionButton
                    id={question.editId}
                    editId={question.editId}
                    kind="edit"
                    onClick={onCopyEditQuestion}
                />
            </div>
            <div className="take-button">
                <TakeQuestionButton id={question.editId} editId={question.editId} onClick={onTakeQuestion} />
            </div>
            <div className="copy-take-button">
                <CopyQuestionButton
                    id={question.editId}
                    editId={question.editId}
                    kind="take"
                    onClick={onCopyTakeQuestion}
                />
            </div>
        </div>
    )
}
