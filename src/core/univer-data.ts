import { BooleanNumber, CellValueType, HorizontalAlign, type ICellData, type IStyleData, type IWorkbookData, WrapStrategy } from "@univerjs/core"
import { colIndex, parseCell } from "./address.ts"
import { type CellInput, type CellStyle, isFormula, type WorkbookState } from "./workbook.ts"

/** Default Univer sizes: the grid the student sees at the start. */
const ROWS = 100
const COLS = 26

const ALIGN_TO_UNIVER = { left: HorizontalAlign.LEFT, center: HorizontalAlign.CENTER, right: HorizontalAlign.RIGHT } as const

export const styleToUniver = (style: CellStyle): IStyleData => ({
  ...(style.bold === true ? { bl: BooleanNumber.TRUE } : {}),
  ...(style.italic === true ? { it: BooleanNumber.TRUE } : {}),
  ...(style.underline === true ? { ul: { s: BooleanNumber.TRUE } } : {}),
  ...(style.strike === true ? { st: { s: BooleanNumber.TRUE } } : {}),
  ...(style.color === undefined ? {} : { cl: { rgb: style.color } }),
  ...(style.fill === undefined ? {} : { bg: { rgb: style.fill } }),
  ...(style.align === undefined ? {} : { ht: ALIGN_TO_UNIVER[style.align] }),
  ...(style.wrap === true ? { tb: WrapStrategy.WRAP } : {}),
  ...(style.fontSize === undefined ? {} : { fs: style.fontSize }),
  ...(style.format === undefined ? {} : { n: { pattern: style.format } })
})

/** Univer writes colors as `#RGB`, `#RRGGBB` or `rgb(r,g,b)`; goals compare `#rrggbb`. */
export const normalizeColor = (color: unknown): string | undefined => {
  if (typeof color !== "string") return undefined
  const c = color.trim().toLowerCase()
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(c)
  if (short !== null) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`
  if (/^#[0-9a-f]{6}$/.test(c)) return c
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(c)
  if (rgb === null) return undefined
  return `#${[rgb[1], rgb[2], rgb[3]].map((n) => Math.min(255, Number(n)).toString(16).padStart(2, "0")).join("")}`
}

const ALIGN_FROM_UNIVER: Partial<Record<number, CellStyle["align"]>> = {
  [HorizontalAlign.LEFT]: "left",
  [HorizontalAlign.CENTER]: "center",
  [HorizontalAlign.RIGHT]: "right"
}

/** Univer style → our style; only what is set. */
export const styleFromUniver = (s: IStyleData | null | undefined): CellStyle | undefined => {
  if (s === null || s === undefined) return undefined
  const color = normalizeColor(s.cl?.rgb)
  const fill = normalizeColor(s.bg?.rgb)
  const align = s.ht === null || s.ht === undefined ? undefined : ALIGN_FROM_UNIVER[s.ht]
  const style: CellStyle = {
    ...(s.bl === BooleanNumber.TRUE ? { bold: true } : {}),
    ...(s.it === BooleanNumber.TRUE ? { italic: true } : {}),
    ...(s.ul?.s === BooleanNumber.TRUE ? { underline: true } : {}),
    ...(s.st?.s === BooleanNumber.TRUE ? { strike: true } : {}),
    ...(color === undefined ? {} : { color }),
    ...(fill === undefined ? {} : { fill }),
    ...(align === undefined ? {} : { align }),
    ...(s.tb === WrapStrategy.WRAP ? { wrap: true } : {}),
    ...(typeof s.fs === "number" ? { fontSize: s.fs } : {}),
    ...(typeof s.n?.pattern === "string" && s.n.pattern !== "" ? { format: s.n.pattern } : {})
  }
  return Object.keys(style).length === 0 ? undefined : style
}

const cellToUniver = (input: CellInput, style: CellStyle | undefined): ICellData => {
  const s = style === undefined ? {} : { s: styleToUniver(style) }
  if (isFormula(input)) return { f: input, ...s }
  if (typeof input === "number") return { v: input, t: CellValueType.NUMBER, ...s }
  if (typeof input === "boolean") return { v: input, t: CellValueType.BOOLEAN, ...s }
  return input === "" ? s : { v: input, t: CellValueType.STRING, ...s }
}

/** Sheet ids are positions: `s1`, `s2`. Names stay as the student set them. */
export const sheetId = (index: number): string => `s${index + 1}`

/** Our workbook → the data Univer opens. */
export const toUniverData = (workbook: WorkbookState, id = "edu-sheets"): Partial<IWorkbookData> => {
  const sheets = workbook.sheets.map((sheet, index) => {
    const cellData: Record<number, Record<number, ICellData>> = {}
    let rows = ROWS
    let cols = COLS
    for (const [address, cell] of Object.entries(sheet.cells)) {
      const pos = parseCell(address)
      if (pos === null) continue
      const row = (cellData[pos.row] ??= {})
      row[pos.col] = cellToUniver(cell.input, cell.style)
      rows = Math.max(rows, pos.row + 1)
      cols = Math.max(cols, pos.col + 1)
    }
    const columnData = Object.fromEntries(Object.entries(sheet.widths ?? {}).map(([col, w]) => [colIndex(col), { w }]))
    return { id: sheetId(index), name: sheet.name, cellData, columnData, rowCount: rows, columnCount: cols }
  })
  return {
    id,
    name: "Таблиця",
    sheetOrder: sheets.map((s) => s.id),
    sheets: Object.fromEntries(sheets.map((s) => [s.id, s]))
  }
}
