import './field.scss'

interface FieldProps {
    readonly label: string
    readonly children: React.ReactNode
    readonly required?: boolean
}

const Required = () => <span className="required">*</span>

export const Field = ({ label, children, required = false }: FieldProps) => (
    <div className="field">
        <div className="label">
            {label} {required && <Required />}
        </div>
        {children}
    </div>
)
