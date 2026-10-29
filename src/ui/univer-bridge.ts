import type { ICellData, IStyleData, IWorkbookData } from "@univerjs/core"
import type { FUniver } from "@univerjs/core/facade"
import { cellName, colName } from "../core/address.ts"
import { ukrainianFormula, ukrainianNumber } from "../core/notation.ts"
import { styleFromUniver } from "../core/univer-data.ts"
import type { CellInput, CellState, SheetState, WorkbookState } from "../core/workbook.ts"

/** The Univer facade with the sheets part loaded (`@univerjs/sheets/facade`). */
export type SheetsAPI = FUniver

/** Univer keeps typed text either as `v` or, after rich editing, as a small document `p`. */
const plainText = (cell: ICellData): string | undefined => {
  const stream = cell.p?.body?.dataStream
  return typeof stream === "string" ? stream.replace(/[\r\n]+$/, "") : undefined
}

const resolveStyle = (s: ICellData["s"], styles: IWorkbookData["styles"] | undefined): IStyleData | undefined => {
  if (s === null || s === undefined) return undefined
  return typeof s === "string" ? (styles?.[s] ?? undefined) : s
}

const inputOf = (cell: ICellData, formula: string): CellInput | undefined => {
  if (formula !== "") return formula
  const v = cell.v
  if (typeof v === "number" || typeof v === "boolean") return v
  if (typeof v === "string") return v
  return plainText(cell)
}

/** What the student has in the table now, in the package's own format. */
export const readWorkbook = (api: SheetsAPI): WorkbookState => {
  const book = api.getActiveWorkbook()
  if (book === null) return { sheets: [] }
  const data = book.save()
  const sheets = book.getSheets()
  return {
    sheets: sheets.map((ws): SheetState => {
      const sheetData = data.sheets[ws.getSheetId()]
      const cells: Record<string, CellState> = {}
      for (const [r, line] of Object.entries(sheetData?.cellData ?? {})) {
        for (const [c, cell] of Object.entries(line ?? {}) as Array<[string, ICellData | null | undefined]>) {
          if (cell === null || cell === undefined) continue
          const row = Number(r)
          const col = Number(c)
          // Copied formulas share one text (`si`); the facade gives each cell its own shifted formula.
          const formula = cell.f || cell.si ? ws.getRange(row, col).getFormula() : ""
          const input = inputOf(cell, formula)
          const style = styleFromUniver(resolveStyle(cell.s, data.styles))
          if ((input === undefined || input === "") && style === undefined) continue
          cells[cellName({ row, col })] = { input: input ?? "", ...(style === undefined ? {} : { style }) }
        }
      }
      const defaultWidth = sheetData?.defaultColumnWidth
      const widths: Record<string, number> = {}
      for (const [c, column] of Object.entries(sheetData?.columnData ?? {})) {
        const w = column?.w
        if (typeof w === "number" && w !== defaultWidth) widths[colName(Number(c))] = Math.round(w)
      }
      return { name: ws.getSheetName(), cells, ...(Object.keys(widths).length === 0 ? {} : { widths }) }
    })
  }
}

/**
 * After the student finishes typing in a cell: `2,5` becomes the number 2.5, and a formula in the textbook notation
 * (`=IF(A1>2,5;"так";"ні")`) becomes one the engine computes.
 */
export const fixUkrainianInput = (api: SheetsAPI, sheetId: string, row: number, column: number): void => {
  const ws = api.getActiveWorkbook()?.getSheetBySheetId(sheetId)
  if (ws === undefined || ws === null) return
  const range = ws.getRange(row, column)
  const formula = range.getFormula()
  if (formula !== "") {
    const fixed = ukrainianFormula(formula)
    if (fixed !== formula) range.setValue(fixed)
    return
  }
  const value = range.getValue()
  const number = typeof value === "string" ? ukrainianNumber(value) : null
  if (number !== null) range.setValue(number)
}
