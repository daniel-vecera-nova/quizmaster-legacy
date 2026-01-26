import './row.scss'

interface RowProps {
    readonly children: React.ReactNode
}

export const Row = ({ children }: RowProps) => <div className="row">{children}</div>
