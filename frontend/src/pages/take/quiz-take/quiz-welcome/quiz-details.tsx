import type { Quiz } from 'model/quiz.ts'
import { StartButton } from 'pages/take/quiz-take/components/buttons.tsx'
import './quiz-details.scss'

export interface QuizDetailsProps {
    readonly quiz: Quiz
    readonly onStart: () => void
}

const getFeedbackText = (mode: string): string => {
    return mode === 'learn' ? 'Continuous feedback' : 'Feedback at the end'
}

export const QuizDetails = ({ quiz, onStart }: QuizDetailsProps) => (
    <div className="quiz-details-container">
        <h1 className="quiz-details-page-title">Welcome to the quiz</h1>
        <div className="quiz-details-card">
            <div className="quiz-details-header">
                <h2 id="quiz-name">{quiz.title}</h2>
                <p id="quiz-description">{quiz.description}</p>
            </div>
            <div className="quiz-details-body">
                <div className="detail-item">
                    <label>Time limit</label>
                    <span id="time-limit">{quiz.timeLimit} seconds</span>
                </div>
                <div className="detail-item">
                    <label>Question count</label>
                    <span id="question-count">{quiz.size || quiz.questions.length}</span>
                </div>
                <div className="detail-item">
                    <label>Pass score</label>
                    <span id="pass-score">{quiz.passScore}%</span>
                </div>
                <div className="detail-item">
                    <label>Feedback</label>
                    <span id="question-feedback">{getFeedbackText(quiz.mode)}</span>
                </div>
            </div>
            <div className="quiz-details-footer">
                <StartButton onClick={onStart} />
            </div>
        </div>
    </div>
)
