// @ts-ignore
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import type { GherkinDocument } from '@cucumber/messages'
import { FeatureDoc } from './html-feature.tsx'

type GherkinHtmlProps = { readonly document: GherkinDocument }

export const GherkinHtml = ({ document }: GherkinHtmlProps) =>
    document.feature && (
        <html lang="en">
            <head>
                <title>{document.feature.name}</title>
                <link rel="stylesheet" href="styles.css" />
            </head>
            <body>
                <FeatureDoc feature={document.feature} />
            </body>
        </html>
    )

export type HtmlFile = {
    readonly name: string
    readonly html: string
}

export const indexHtml = (htmlFiles: HtmlFile[]): string => {
    const index = (
        <html lang="en">
            <head>
                <title>Cucumber Features</title>
            </head>
            <body>
                <h1>Cucumber Features</h1>
                <ul>
                    {htmlFiles.map(htmlFile => (
                        <li>
                            <a href={htmlFile.name}>{htmlFile.name}</a>
                        </li>
                    ))}
                </ul>
            </body>
        </html>
    )

    return ReactDOMServer.renderToStaticMarkup(index)
}

export const toHtml = (document: GherkinDocument): string =>
    ReactDOMServer.renderToStaticMarkup(<GherkinHtml document={document} />)
