import { cellName, cellsOf, parseCell } from "./address.ts"

/** What the student typed into a cell. A string that starts with `=` is a formula. */
export type CellInput = string | number | boolean

/** The part of cell formatting that school tasks talk about. Colors are `#rrggbb`. */
export interface CellStyle {
  readonly bold?: boolean
  readonly italic?: boolean
  readonly underline?: boolean
  readonly strike?: boolean
  readonly color?: string
  readonly fill?: string
  readonly align?: "left" | "center" | "right"
  readonly wrap?: boolean
  readonly fontSize?: number
  /** Number format pattern as Excel writes it: `0.00`, `0%`, `#,##0 ₴`. */
  readonly format?: string
}

export interface CellState {
  readonly input: CellInput
  readonly style?: CellStyle
}

export interface SheetState {
  readonly name: string
  /** Non-empty cells by address: `{ A1: { input: "Назва" }, C2: { input: "=A2*B2" } }`. */
  readonly cells: Readonly<Record<string, CellState>>
  /** Column widths in pixels by column letter: `{ A: 160 }`. Other columns keep the default width. */
  readonly widths?: Readonly<Record<string, number>>
}

/** The whole table: what a task starts with and what the student hands in. */
export interface WorkbookState {
  readonly sheets: ReadonlyArray<SheetState>
}

/** A start sheet as an author writes it: a cell is a value, or a value with formatting. */
export interface SheetSpec {
  /** Default: «Аркуш1», «Аркуш2»… */
  readonly name?: string
  readonly cells: Readonly<Record<string, CellInput | CellState>>
  readonly widths?: Readonly<Record<string, number>>
}

export const DEFAULT_SHEET = "Аркуш1"

export const sheetSpecName = (spec: SheetSpec, index: number): string => spec.name ?? `Аркуш${index + 1}`

const isCellState = (value: CellInput | CellState): value is CellState => typeof value === "object"

/** The start workbook of a task. */
export const buildWorkbook = (specs: ReadonlyArray<SheetSpec>): WorkbookState => ({
  sheets: (specs.length === 0 ? [{ cells: {} }] : specs).map((spec, i) => ({
    name: sheetSpecName(spec, i),
    cells: Object.fromEntries(Object.entries(spec.cells).map(([address, value]) => [address.toUpperCase(), isCellState(value) ? value : { input: value }])),
    ...(spec.widths === undefined ? {} : { widths: spec.widths })
  }))
})

export const isFormula = (input: CellInput): input is string => typeof input === "string" && input.startsWith("=") && input.length > 1

export const findSheet = (workbook: WorkbookState, name: string | undefined): SheetState | undefined =>
  name === undefined ? workbook.sheets[0] : workbook.sheets.find((s) => s.name === name)

export const cellOf = (sheet: SheetState | undefined, address: string): CellState | undefined => sheet?.cells[address.toUpperCase()]

/** A copy of the workbook with new inputs in some cells: `{ B2: 100 }`. Formatting stays. */
export const withInputs = (workbook: WorkbookState, sheetName: string | undefined, inputs: Readonly<Record<string, CellInput>>): WorkbookState => {
  const target = findSheet(workbook, sheetName)
  return {
    sheets: workbook.sheets.map((sheet) =>
      sheet !== target
        ? sheet
        : {
            ...sheet,
            cells: {
              ...sheet.cells,
              ...Object.fromEntries(Object.entries(inputs).map(([address, input]) => [address.toUpperCase(), { ...sheet.cells[address.toUpperCase()], input }]))
            }
          }
    )
  }
}

/** Limits for a handed-in workbook. A school task needs far less; the server refuses more. */
export const LIMITS = { sheets: 10, cells: 5_000, input: 2_000 } as const

const COLOR = /^#[0-9a-f]{6}$/i

const validStyle = (style: unknown): boolean => {
  if (style === undefined) return true
  if (typeof style !== "object" || style === null) return false
  const s = style as Record<string, unknown>
  const flags = ["bold", "italic", "underline", "strike", "wrap"].every((k) => s[k] === undefined || typeof s[k] === "boolean")
  const colors = ["color", "fill"].every((k) => s[k] === undefined || (typeof s[k] === "string" && COLOR.test(s[k])))
  const align = s.align === undefined || s.align === "left" || s.align === "center" || s.align === "right"
  const size = s.fontSize === undefined || (typeof s.fontSize === "number" && s.fontSize > 0 && s.fontSize <= 400)
  const format = s.format === undefined || (typeof s.format === "string" && s.format.length <= 100)
  return flags && colors && align && size && format
}

const validInput = (input: unknown): boolean =>
  (typeof input === "string" && input.length <= LIMITS.input) || (typeof input === "number" && Number.isFinite(input)) || typeof input === "boolean"

/** Checks a workbook that came from outside (a saved answer) before the server reads it. */
export const parseWorkbook = (data: unknown): WorkbookState | null => {
  if (typeof data !== "object" || data === null) return null
  const sheets = (data as { sheets?: unknown }).sheets
  if (!Array.isArray(sheets) || sheets.length === 0 || sheets.length > LIMITS.sheets) return null
  let total = 0
  for (const sheet of sheets) {
    if (typeof sheet !== "object" || sheet === null) return null
    const { name, cells, widths } = sheet as Record<string, unknown>
    if (typeof name !== "string" || name.length === 0 || name.length > 100) return null
    if (typeof cells !== "object" || cells === null) return null
    for (const [address, cell] of Object.entries(cells)) {
      total++
      if (total > LIMITS.cells || parseCell(address) === null || cellName(parseCell(address) ?? { row: 0, col: 0 }) !== address) return null
      if (typeof cell !== "object" || cell === null) return null
      const { input, style } = cell as Record<string, unknown>
      if (!validInput(input) || !validStyle(style)) return null
    }
    if (widths !== undefined) {
      if (typeof widths !== "object" || widths === null) return null
      for (const [col, w] of Object.entries(widths)) if (!/^[A-Z]{1,2}$/.test(col) || typeof w !== "number" || !(w > 0 && w <= 2000)) return null
    }
  }
  return data as WorkbookState
}

/** Column letter of an address or a range start: `C7` → `C`. */
export const columnOf = (address: string): string => address.replace(/[^A-Za-z]/g, "").toUpperCase()

/** All cells of the ranges in a goal: `"B2:B6"` or `["B2", "D2:D3"]`. */
export const cellsIn = (ranges: string | ReadonlyArray<string>): ReadonlyArray<string> =>
  (typeof ranges === "string" ? [ranges] : ranges).flatMap((r) => cellsOf(r))
