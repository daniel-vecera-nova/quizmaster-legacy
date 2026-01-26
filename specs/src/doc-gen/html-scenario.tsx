// @ts-ignore
import React from 'react'
import type { Examples, Scenario, TableCell, TableRow } from '@cucumber/messages'
import { TableHead, TableBody, type TableCells } from './html-table.tsx'
import { StepsDoc } from './html-steps.tsx'
import { Description } from './html-desc.tsx'

type ExamplesDocProps = {
    readonly examples: Examples
    readonly exampleIndex?: number
}

const fakeCell = (value: string): TableCell => ({
    value,
    location: { line: 0, column: 0 },
})

const ExamplesDoc = ({ examples, exampleIndex }: ExamplesDocProps) => {
    const exampleHeader: TableCells = [fakeCell(''), ...(examples.tableHeader?.cells || [])]

    const exampleRows: readonly TableRow[] = examples.tableBody.map((row, index) => ({
        ...row,
        cells: [fakeCell(index + 1 === exampleIndex ? '🖼️' : ''), ...row.cells],
    }))

    return (
        <>
            <h3>Examples</h3>
            <table>
                {examples.tableHeader && <TableHead cells={exampleHeader} />}
                <TableBody rows={exampleRows} />
            </table>
        </>
    )
}

const screenshot = (scenario: Scenario): [string, number] => {
    const scenarioTag = scenario.tags.find(tag => tag.name.startsWith('@screenshot:'))

    if (!scenarioTag) return ['', 0]

    const [, fileName, exampleIndex] = scenarioTag.name.split(':')

    return [fileName, Number(exampleIndex)]
}

type ScreenshotProps = { readonly fileName: string }

const Screenshot = ({ fileName }: ScreenshotProps) => (
    <img className="screenshot" src={`screenshots/${fileName}`} alt="Screenshot" />
)

type ScenarioDocProps = { readonly scenario: Scenario }

export const ScenarioDoc = ({ scenario }: ScenarioDocProps) => {
    const [screenshotFileName, exampleIndex] = screenshot(scenario)

    return (
        <>
            <h2>{scenario.name}</h2>
            <Description description={scenario.description} />
            <StepsDoc steps={scenario.steps} />
            {scenario.examples?.map(examples => (
                <ExamplesDoc examples={examples} exampleIndex={exampleIndex} />
            ))}
            {screenshotFileName && <Screenshot fileName={screenshotFileName} />}
        </>
    )
}
