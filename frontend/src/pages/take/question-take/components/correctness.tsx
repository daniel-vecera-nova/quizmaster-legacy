import './correctness.css'

interface CorrectnessProps {
    readonly isPartialCorrectnessEnabled: boolean
    readonly score: number
    readonly errorCount: number
}

export const Correctness = (props: CorrectnessProps) => {
    let label: string
    let className: string
    if (props.isPartialCorrectnessEnabled && props.score < 1 && props.score > 0) {
        label = `Partially correct! (${props.errorCount} error${props.errorCount !== 1 ? 's' : ''})`
        className = 'partial-correct'
    } else {
        label = props.score === 1 ? 'Correct!' : 'Incorrect!'
        className = props.score === 1 ? 'correct' : 'incorrect'
    }
    console.log('Correctness render', props, label, className)
    return <span className={`feedback ${className}`}>{label}</span>
}

export const QuestionCorrectness = (props: CorrectnessProps) => (
    <p className="question-feedback">
        <Correctness {...props} />
    </p>
)
