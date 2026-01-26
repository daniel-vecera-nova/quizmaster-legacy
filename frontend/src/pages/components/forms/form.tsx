import './form.scss'
import { useState } from 'react'
import { preventDefault } from 'helpers.ts'
import { type FormValidator, ValidationsProvider } from './validations.tsx'

interface FormProps<K extends string> {
    readonly id?: string
    readonly children: React.ReactNode
    readonly validator?: FormValidator<K>
    readonly onSubmit: () => void
}

export function Form<K extends string>({ id, children, validator, onSubmit }: FormProps<K>) {
    const [errors, setErrors] = useState<Set<K>>(new Set())

    const submit = preventDefault(() => {
        const errors = validator?.validate() ?? new Set()
        setErrors(errors)
        if (errors.size === 0) onSubmit()
    })

    return (
        <ValidationsProvider errors={errors} errorMessages={validator?.errorMessages}>
            <form id={id} onSubmit={submit}>
                {children}
            </form>
        </ValidationsProvider>
    )
}
