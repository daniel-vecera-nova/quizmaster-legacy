import { Button, type WithOnClick } from 'pages/components/button'
import { useNavigate } from 'react-router-dom'
import copyClipboardIcon from 'assets/icons/copy-clipboard.svg'
import { QuestionItem } from './question-item'
import './workspace.scss'
import type { QuestionListItem } from 'model/question-list-item'
import type { Workspace } from 'model/workspace'
import type { QuizListItem } from 'model/quiz-list-item'
import { QuizItem } from '../quiz-create/quiz-item'

interface WorkspaceProps {
    readonly workspace: Workspace
    readonly questions: readonly QuestionListItem[]
    readonly quizzes: readonly QuizListItem[]
}

type EditQuestionButtonProps = { id: string; editId: string; onClick: () => void }
type TakeQuestionButtonProps = { id: string; editId: string; onClick: () => void }
type CopyQuestionButtonProps = { id: string; kind: string; editId: string; onClick: () => void }

export const CreateQuestionButton = ({ onClick }: WithOnClick) => (
    <Button id="create-question" onClick={onClick}>
        Create New Question
    </Button>
)

export const EditQuestionButton = ({ id, onClick }: EditQuestionButtonProps) => (
    <Button id={id} className="edit-question" onClick={onClick}>
        Edit
    </Button>
)

export const TakeQuestionButton = ({ id, onClick }: TakeQuestionButtonProps) => (
    <Button id={id} className="take-question" onClick={onClick}>
        Take
    </Button>
)

export const CopyQuestionButton = ({ id, kind, onClick }: CopyQuestionButtonProps) => (
    <Button id={id} className="copy-question" onClick={onClick}>
        <img
            id={`image${kind}${id}`}
            src={copyClipboardIcon}
            alt={`Copy the ${kind} url to clipboard`}
            title={`Copy the ${kind} url to clipboard`}
            style={{ width: '1em', height: '1em', verticalAlign: 'middle' }}
            onError={e => {
                e.currentTarget.style.display = 'none'
            }}
        />
    </Button>
)

export const CreateQuizButton = ({ onClick }: WithOnClick) => (
    <Button id="create-quiz" onClick={onClick} className="primary button">
        Create Quiz
    </Button>
)

export function WorkspaceComponent({ workspace, questions, quizzes }: WorkspaceProps) {
    const navigate = useNavigate()

    const onCreateNewQuestion = () => {
        navigate(`/question/new?workspaceguid=${workspace?.guid}`)
    }

    const onEditQuestion = (editId: string) => {
        navigate(`/question/${editId}/edit`)
    }

    const onTakeQuestion = (id: number) => {
        navigate(`/question/${id}`)
    }

    const onCopyTakeQuestion = async (id: number) => {
        const link = `${window.location.origin}/question/${id}`
        await navigator.clipboard.writeText(link)
    }

    const onCopyEditQuestion = async (editId: string) => {
        const link = `${window.location.origin}/question/${editId}/edit`
        try {
            await navigator.clipboard.writeText(link)
            window.alert('link copied')
        } catch (err) {
            window.alert('Failed to copy link')
        }
    }

    const onCreateQuiz = () => {
        navigate(`/quiz-create/new?workspaceguid=${workspace.guid}`)
    }

    return (
        <div className="workspace-page">
            {workspace.title && (
                <h1 id="question-title-header" data-testid="workspace-title">
                    {workspace.title}
                </h1>
            )}
            <div className="create-button">
                <CreateQuestionButton onClick={onCreateNewQuestion} />
            </div>
            <h3>My Questions</h3>
            <div className="question-holder">
                {questions.map((q, index) => (
                    <QuestionItem
                        key={q.id || index}
                        question={q}
                        index={index}
                        onEditQuestion={() => onEditQuestion(q.editId)}
                        onCopyEditQuestion={() => onCopyEditQuestion(q.editId)}
                        onTakeQuestion={() => onTakeQuestion(q.id)}
                        onCopyTakeQuestion={() => onCopyTakeQuestion(q.id)}
                    />
                ))}
            </div>

            <CreateQuizButton onClick={onCreateQuiz} />
            <h3>My quizzes</h3>
            <div>
                {quizzes.map(quiz => (
                    <QuizItem key={quiz.id} quiz={quiz} />
                ))}
            </div>
        </div>
    )
}
