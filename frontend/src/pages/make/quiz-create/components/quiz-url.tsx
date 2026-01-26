import { Alert } from 'pages/components'

interface QuizUrlProps {
    readonly quizId: string
}

export const QuizUrl = ({ quizId }: QuizUrlProps) => {
    const url = `${location.origin}/quiz/${quizId}`

    return (
        <Alert type="success">
            Quiz url: <a href={url}>{url}</a>
        </Alert>
    )
}
