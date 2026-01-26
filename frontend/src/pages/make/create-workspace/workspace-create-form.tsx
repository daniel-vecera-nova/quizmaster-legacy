import { useState } from 'react'
import { Field, SubmitButton, TextInput, Form, Row } from 'pages/components'

export interface WorkspaceFormData {
    readonly title: string
}

interface WorkspaceCreateProps {
    readonly onSubmit: (data: WorkspaceFormData) => void
}

export const WorkspaceCreateForm = ({ onSubmit }: WorkspaceCreateProps) => {
    const [title, setTitle] = useState<string>('')

    const toFormData = (title: string): WorkspaceFormData => ({ title })

    return (
        <Form onSubmit={() => onSubmit(toFormData(title))}>
            <Field label="Workspace Title">
                <TextInput id="workspace-title" value={title} onChange={setTitle} />
            </Field>
            <Row>
                <SubmitButton />
            </Row>
        </Form>
    )
}
