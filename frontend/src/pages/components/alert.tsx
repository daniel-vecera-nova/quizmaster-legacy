import './alert.scss'

type AlertType = 'success' | 'error' | 'info'

interface AlertProps {
    readonly type: AlertType
    readonly children: React.ReactNode
    readonly dataTestId?: string
}

export const Alert = ({ type, children, dataTestId }: AlertProps) => (
    <div className={`alert ${type}`} data-testid={dataTestId}>
        {children}
    </div>
)
