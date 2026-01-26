import './question-score.scss'

interface QuestionScoreProps {
    readonly score: number
}

export const QuestionScore = (props: QuestionScoreProps) => <p className="question-score">Score: {props.score}</p>
