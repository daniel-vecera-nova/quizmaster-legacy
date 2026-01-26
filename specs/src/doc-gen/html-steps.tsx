// @ts-ignore
import type React from 'react'
import type { Step } from '@cucumber/messages'
import { DataTableDoc } from './html-table'

let lastKeyword = ''

type KeywordProps = { readonly keyword: string }

const Keyword = ({ keyword }: KeywordProps) => {
    const className = keyword.toLowerCase().trim()

    lastKeyword = ['and', 'but', '*'].includes(className) ? lastKeyword : className

    return <span className={lastKeyword}>{keyword}</span>
}

const transformQuotedText = (text: string): React.ReactNode => {
    const regex = /"([^"]+)"/g
    const parts = []
    let lastIndex = 0
    let match = regex.exec(text)

    while (match !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index))
        }

        parts.push(<span className="param">{match[1]}</span>)

        lastIndex = match.index + match[0].length
        match = regex.exec(text)
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex))
    }

    return parts
}

type StepDocProps = { readonly step: Step }

const StepDoc = ({ step }: StepDocProps) => (
    <li>
        <p>
            <Keyword keyword={step.keyword} />
            <span>{transformQuotedText(step.text)}</span>
        </p>
        {step.dataTable && <DataTableDoc dataTable={step.dataTable} />}
    </li>
)

type StepsDocProps = { readonly steps: readonly Step[] }

export const StepsDoc = ({ steps }: StepsDocProps) => (
    <ul className="steps">
        {steps.map(step => (
            <StepDoc step={step} />
        ))}
    </ul>
)
