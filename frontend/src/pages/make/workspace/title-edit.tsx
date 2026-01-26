interface TitleEditProps {
    readonly title: string
    readonly setTitle: (title: string) => void
}

export const TitleEdit = ({ title, setTitle }: TitleEditProps) => (
    <>
        <label htmlFor="question-text">Enter workspace title:</label>
        <textarea
            id="workspace-title"
            data-testid="workspace-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            rows={1}
        />
    </>
)
