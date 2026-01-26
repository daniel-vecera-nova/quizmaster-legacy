// @ts-ignore
import React from 'react'
import Markdown from 'react-markdown'

type DescriptionProps = { readonly description?: string }

export const Description = ({ description }: DescriptionProps) => {
    if (!description) return null

    const trimmed = description
        .split('\n')
        .map(line => line.trim())
        .join('\n')

    return trimmed && <Markdown>{trimmed}</Markdown>
}
