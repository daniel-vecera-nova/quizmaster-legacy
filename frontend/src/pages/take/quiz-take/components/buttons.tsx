import { Button, type WithOnClick } from 'pages/components/button'

export const NextButton = ({ onClick }: WithOnClick) => (
    <Button id="next" onClick={onClick}>
        Next Question
    </Button>
)

export const EvaluateButton = ({ onClick }: WithOnClick) => (
    <Button id="evaluate" className="submit-btn-evaluate" onClick={onClick}>
        Evaluate
    </Button>
)
export const BackButton = ({ onClick }: WithOnClick) => (
    <Button id="back" onClick={onClick}>
        Back
    </Button>
)

export const StartButton = ({ onClick }: WithOnClick) => (
    <Button id="start" type="button" onClick={onClick}>
        Start
    </Button>
)

interface BookmarkButtonProps {
    readonly isBookmarked: boolean
    readonly onClick: () => void
}

export const BookmarkButton = ({ isBookmarked, onClick }: BookmarkButtonProps) => (
    <Button type="button" onClick={onClick} data-testid="bookmark-toggle" data-bookmarked={isBookmarked}>
        {isBookmarked ? 'Unbookmark ⭐' : 'Bookmark ☆'}
    </Button>
)
