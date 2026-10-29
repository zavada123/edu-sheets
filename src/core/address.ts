/** Cell addresses as students write them: `B2`, `$B$2`, ranges `B2:D6`. Rows and columns start at 0 inside. */

export interface CellPos {
  readonly row: number
  readonly col: number
}

/** Columns up to `ZZ` (702), rows up to 10 000: much more than a school task needs. */
export const MAX_COL = 702
export const MAX_ROW = 10_000

const CELL = /^\$?([A-Za-z]{1,2})\$?(\d{1,5})$/

/** `A` → 0, `Z` → 25, `AA` → 26. */
export const colIndex = (letters: string): number => [...letters.toUpperCase()].reduce((n, ch) => n * 26 + (ch.charCodeAt(0) - 64), 0) - 1

/** 0 → `A`, 26 → `AA`. */
export const colName = (index: number): string => {
  let n = index + 1
  let name = ""
  while (n > 0) {
    const rest = (n - 1) % 26
    name = String.fromCharCode(65 + rest) + name
    n = Math.floor((n - 1) / 26)
  }
  return name
}

/** `B2` → `{ row: 1, col: 1 }`; `null` for anything else. `$` signs are allowed. */
export const parseCell = (address: string): CellPos | null => {
  const m = CELL.exec(address.trim())
  if (m === null) return null
  const col = colIndex(m[1] ?? "")
  const row = Number(m[2]) - 1
  if (row < 0 || row >= MAX_ROW || col >= MAX_COL) return null
  return { row, col }
}

export const cellName = ({ row, col }: CellPos): string => `${colName(col)}${row + 1}`

/** `B2:C3` → `B2 C2 B3 C3` (row by row); one cell → itself; `[]` for a wrong range. */
export const cellsOf = (range: string): ReadonlyArray<string> => {
  const [from, to = from] = range.split(":")
  const a = parseCell(from ?? "")
  const b = parseCell(to ?? "")
  if (a === null || b === null) return []
  const cells: string[] = []
  for (let row = Math.min(a.row, b.row); row <= Math.max(a.row, b.row); row++) {
    for (let col = Math.min(a.col, b.col); col <= Math.max(a.col, b.col); col++) cells.push(cellName({ row, col }))
  }
  return cells
}

/** Text in quotes is not code: `="B2"` names no cell. */
const withoutStrings = (formula: string): string => formula.replace(/"[^"]*"/g, '""')

const REF = /(?<![A-Za-z0-9_$.])(\$?[A-Za-z]{1,2}\$?\d{1,5})(?::(\$?[A-Za-z]{1,2}\$?\d{1,5}))?(?![A-Za-z0-9_(])/g

/** Every cell the formula reads, ranges opened: `=SUM(B2:B4)*$C$1` → `B2 B3 B4 C1`. */
export const refsIn = (formula: string): ReadonlySet<string> => {
  const refs = new Set<string>()
  for (const m of withoutStrings(formula).matchAll(REF)) {
    const range = m[2] === undefined ? (m[1] ?? "") : `${m[1]}:${m[2]}`
    for (const cell of cellsOf(range.replace(/\$/g, ""))) refs.add(cell)
  }
  return refs
}

/** Function names in a formula, upper case: `=sum(B2:B4)+Max(C1;2)` → `SUM MAX`. */
export const functionsIn = (formula: string): ReadonlySet<string> =>
  new Set([...withoutStrings(formula).matchAll(/([A-Za-z][A-Za-z0-9.]*)\s*\(/g)].map((m) => (m[1] ?? "").toUpperCase()))
