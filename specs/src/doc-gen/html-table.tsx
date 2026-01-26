// @ts-ignore
import React from 'react'
import type { DataTable, TableCell, TableRow } from '@cucumber/messages'

export type TableCells = readonly TableCell[]

type TableCellsProps = { readonly cells: TableCells }

const TableCells = ({ cells }: TableCellsProps) => (
    <tr>
        {cells.map(cell => (
            <td>{cell.value}</td>
        ))}
    </tr>
)

type TableHeadProps = { readonly cells: TableCells }

export const TableHead = ({ cells }: TableHeadProps) => (
    <thead>
        <tr>
            {cells.map(cell => (
                <th>{cell.value}</th>
            ))}
        </tr>
    </thead>
)

type TableBodyProps = { readonly rows: readonly TableRow[] }

export const TableBody = ({ rows }: TableBodyProps) => (
    <tbody>
        {rows.map(row => (
            <TableCells cells={row.cells} />
        ))}
    </tbody>
)

type DataTableDocProps = { readonly dataTable: DataTable }

export const DataTableDoc = ({ dataTable }: DataTableDocProps) => {
    const firstChar = dataTable.rows[0].cells[0].value[0]
    const hasHeader = firstChar.toLocaleLowerCase() === firstChar

    const [header, rows] = hasHeader ? [dataTable.rows[0].cells, dataTable.rows.slice(1)] : [undefined, dataTable.rows]

    return (
        <table>
            {header && <TableHead cells={header} />}
            <TableBody rows={rows} />
        </table>
    )
}
