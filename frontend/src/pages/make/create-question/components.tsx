export const LoadedIndicator = ({ isLoaded }: { isLoaded: boolean }) => (
    <input id="is-loaded" type="hidden" value={isLoaded ? 'loaded' : ''} />
)

export const QuestionLink = ({ url }: { url: string }) =>
    url && (
        <>
            <h3>Link to take the question:</h3>
            <a id="question-link" href={url}>
                {url}
            </a>
        </>
    )

export const QuestionEditLink = ({ editUrl }: { editUrl: string }) =>
    editUrl && (
        <>
            <h3>Link to edit the question:</h3>
            <a id="question-edit-link" href={editUrl}>
                {editUrl}
            </a>
            <p>*You wont be able to get this link once you close this page</p>
        </>
    )
