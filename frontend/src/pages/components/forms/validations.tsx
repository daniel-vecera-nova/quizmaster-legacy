import { createContext, useContext } from 'react'
import { Alert } from '../alert.tsx'

type ErrorMessages<K extends string> = Record<K, string>

type Validate<K extends string> = () => Set<K>

export type FormValidator<K extends string> = {
    readonly validate: Validate<K>
    readonly errorMessages: ErrorMessages<K>
}

export const createValidator = <K extends string>(
    validate: Validate<K>,
    errorMessages: ErrorMessages<K>,
): FormValidator<K> => ({
    validate,
    errorMessages,
})

type FormValidationContext<K extends string> = {
    readonly errorMessages?: ErrorMessages<K>
    readonly errors: Set<K>
}

const FormContext = createContext<FormValidationContext<string> | null>(null)

interface ValidationsProviderProps<K extends string> {
    readonly errorMessages?: ErrorMessages<K>
    readonly errors: Set<K>
    readonly children: React.ReactNode
}

export function ValidationsProvider<K extends string>({
    errorMessages,
    errors,
    children,
}: ValidationsProviderProps<K>) {
    return <FormContext.Provider value={{ errorMessages, errors }}>{children}</FormContext.Provider>
}

function useValidations<K extends string>(): FormValidationContext<K> {
    const context = useContext(FormContext)
    if (!context) throw new Error('useValidations must be used within ValidationsProvider')
    return context as FormValidationContext<K>
}

type ErrorMessageProps = {
    readonly errorCode: string
}

export const ErrorMessage = ({ errorCode }: ErrorMessageProps) => {
    const { errors, errorMessages } = useValidations<string>()

    const errorMessage = errors.has(errorCode) && errorMessages?.[errorCode || '']

    return (
        errorMessage && (
            <Alert type="error" dataTestId={errorCode}>
                {errorMessage}
            </Alert>
        )
    )
}
