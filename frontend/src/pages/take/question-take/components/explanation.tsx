import './explanation.scss'

interface ExplanationProps {
    readonly text: string
}

export const Explanation = (props: ExplanationProps) => <p className="explanation">{props.text}</p>

export const QuestionExplanation = (props: ExplanationProps) => <p className="question-explanation">{props.text}</p>
