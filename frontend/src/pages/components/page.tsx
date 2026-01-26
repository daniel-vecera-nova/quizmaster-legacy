import './page.scss'

interface PageProps {
    readonly id?: string
    readonly title: string
    readonly children: React.ReactNode
}

export const Page = ({ id, title, children }: PageProps) => (
    <div id={id} className="page">
        <h1>{title}</h1>
        {children}
    </div>
)
