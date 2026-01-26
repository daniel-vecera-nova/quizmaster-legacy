import type React from 'react'

interface BookmarkListProps {
    bookmarks: { title: string; onClick: () => void; onDelete: () => void }[]
}

export const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks }) => (
    <table data-testid="bookmark-list">
        <tbody>
            {bookmarks.map(bookmark => (
                <tr key={bookmark.title}>
                    <td>
                        <button type="button" onClick={bookmark.onClick}>
                            {bookmark.title}
                        </button>
                    </td>
                    <td>
                        <button
                            type="button"
                            aria-label={`delete-bookmark-${bookmark.title}`}
                            data-testid={`delete-bookmark-${bookmark.title}`}
                            onClick={bookmark.onDelete}
                        >
                            🗑️
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)
