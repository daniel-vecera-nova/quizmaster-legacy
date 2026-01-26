import './radio-set.scss'

interface RadioSetProps<V extends string> {
    readonly name: string
    readonly value: V
    readonly onChange: (value: V) => void
    readonly options: Record<V, string>
}

export function RadioSet<V extends string>({ name, value, onChange, options }: RadioSetProps<V>) {
    return (
        <span className="radio-set">
            {Object.entries(options).map(([optValue, label]) => (
                <label key={optValue} className="check">
                    <input
                        type="radio"
                        id={`${name}-${optValue}`}
                        name={name}
                        value={optValue}
                        checked={value === optValue}
                        onChange={e => onChange(e.target.value as V)}
                    />
                    {label as string}
                </label>
            ))}
        </span>
    )
}
