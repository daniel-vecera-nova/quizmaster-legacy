import type { InputProps } from './input.tsx'

export const TextArea = ({ placeholder, className, id, value, onChange }: InputProps<string>) => (
    <textarea
        id={id}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
    />
)
