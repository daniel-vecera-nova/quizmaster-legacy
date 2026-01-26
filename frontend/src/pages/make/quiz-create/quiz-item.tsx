import type React from 'react'
import { useNavigate } from 'react-router-dom'
import type { QuizListItem } from 'model/quiz-list-item'
import { Button } from 'pages/components/button'
import copyClipboardIcon from 'assets/icons/copy-clipboard.svg'

interface Props {
    readonly quiz: QuizListItem
}

export const QuizItem: React.FC<Props> = ({ quiz }) => {
    const navigate = useNavigate()

    const onTakeQuiz = () => navigate(`/quiz/${quiz.id}`)

    const copyQuizLink = () => navigator.clipboard.writeText(`${window.location.origin}/quiz/${quiz.id}`)

    const onStatsQuiz = () => navigate(`/quiz/${quiz.id}/stats`)

    return (
        <div className="quiz-item question-item">
            <span id="quiz-text">
                {quiz.title}
                <span className="take-quiz-button take-button">
                    <Button className="take-quiz" onClick={onTakeQuiz}>
                        Take
                    </Button>
                </span>
                <span className="copy-take-button copy-button">
                    <Button className="copy-take" onClick={copyQuizLink}>
                        <img
                            id={quiz.id.toString()}
                            src={copyClipboardIcon}
                            alt="Copy the quiz url to clipboard"
                            title="Copy the quiz url to clipboard"
                            style={{ width: '1em', height: '1em', verticalAlign: 'middle' }}
                            onError={e => {
                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    </Button>
                </span>
                <span className="stats-quiz-button stats-button">
                    <Button className="stats-quiz" onClick={onStatsQuiz}>
                        Statistics
                    </Button>
                </span>
            </span>
        </div>
    )
}
