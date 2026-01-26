import './checkbox.scss'

interface CheckboxProps {
    readonly id?: string
    readonly checked: boolean
    readonly onToggle: (value: boolean) => void
}

export const Checkbox = ({ id, checked, onToggle }: CheckboxProps) => (
    <input type="checkbox" id={id} checked={checked} onChange={e => onToggle(e.target.checked)} />
)

interface CheckFieldProps extends CheckboxProps {
    readonly label: string
}

export const CheckField = ({ id, label, checked, onToggle }: CheckFieldProps) => (
    <label className="check">
        <Checkbox id={id} checked={checked} onToggle={onToggle} /> {label}
    </label>
)
