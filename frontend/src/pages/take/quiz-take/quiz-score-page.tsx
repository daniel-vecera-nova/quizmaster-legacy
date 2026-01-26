import type { Quiz } from 'model/quiz.ts'
import { QuestionFeedback } from './components/question'
import type { QuizAnswers } from './quiz-answers-state.ts'
import { evaluate } from './quiz-score.ts'

export const QuizScorePage = ({ quiz, quizAnswers }: { quiz: Quiz; quizAnswers: QuizAnswers }) => {
    const evaluation = evaluate(quiz, quizAnswers)
    const { total, score } = evaluation

    const percentage = (score / total) * 100
    const passed = percentage >= quiz.passScore
    const result = passed ? 'passed' : 'failed'

    return (
        <>
            <h1>Test result</h1>
            <div className="resultTable" id="results">
                <div className="row header">
                    <div>Points</div>
                    <div>Score</div>
                    <div>Min pass score</div>
                    <div>State</div>
                </div>
                <div className="row">
                    <div>
                        <span id="correct-answers">{score}</span> / <span id="total-questions">{total}</span>
                    </div>
                    <div>
                        <span id="percentage-result">{percentage.toFixed(0)}</span> %
                    </div>
                    <div>
                        <span id="pass-score">{quiz.passScore}</span> %
                    </div>
                    <div>
                        <span id="text-result">{result}</span>
                    </div>
                </div>
            </div>

            <h2>Answer overview</h2>
            {quiz.questions.map((question, idx) => (
                <QuestionFeedback question={question} selectedAnswerIdxs={quizAnswers.finalAnswers[idx]} />
            ))}
        </>
    )
}
