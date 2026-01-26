import { Link } from 'react-router-dom'

export const HomePage = () => {
    return (
        <>
            <h1>Welcome to Quizmaster! You rock.</h1>
            <Link to="/question/new">Create new question</Link>
            <br />
            <Link to="/workspace/new">Create new workspace</Link>
        </>
    )
}
