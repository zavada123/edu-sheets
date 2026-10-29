import { functionsIn, refsIn } from "./address.ts"
import { type CellValue, type Computed, compute } from "./compute.ts"
import { type CellInput, type CellStyle, cellOf, cellsIn, columnOf, findSheet, isFormula, type WorkbookState, withInputs } from "./workbook.ts"

/** Text and hint an author may set on any goal; `sheet` picks a sheet by name (default: the first). */
interface GoalBase {
  readonly text?: string
  readonly hint?: string
  readonly sheet?: string
}

/** Cells as a range `"D2:D6"`, one cell `"B5"` or a list `["B5", "D2:D3"]`. */
export type Cells = string | ReadonlyArray<string>

/**
 * Conditions a scenario checks on the final table. Authors pick them from this list, no programming needed.
 * Values are the computed ones: a formula counts by its result.
 */
export type Goal = GoalBase &
  (
    | {
        /** Each cell shows this value; a list gives a value per cell, row by row. */
        readonly type: "value"
        readonly cells: Cells
        readonly equals: CellValue | ReadonlyArray<CellValue>
        /** Allowed difference for numbers. Default: none (rounding noise only). */
        readonly tolerance?: number
      }
    | {
        /** Each cell holds a formula, not a typed number. */
        readonly type: "formula"
        readonly cells: Cells
        /** The formula must call these functions: `["SUM"]`. */
        readonly functions?: ReadonlyArray<string>
        /** `false` allows a formula with numbers only (`=12*3`). Default: it must read other cells. */
        readonly refs?: boolean
      }
    | {
        /** The formulas give the right result for other data: the checker puts `set` into the cells and computes again. */
        readonly type: "recalc"
        readonly set: Readonly<Record<string, CellInput>>
        readonly cells: Cells
        readonly equals: CellValue | ReadonlyArray<CellValue>
        readonly tolerance?: number
      }
    | {
        /** Each cell has at least this formatting; other formatting is allowed. */
        readonly type: "style"
        readonly cells: Cells
        readonly style: CellStyle
      }
    | { readonly type: "filled"; readonly cells: Cells }
    | {
        /** Rows of the range are ordered by a column and stayed whole (a row was not split while sorting). */
        readonly type: "sorted"
        readonly range: string
        readonly by: string
        readonly order?: "asc" | "desc"
      }
    | { readonly type: "width"; readonly column: string; readonly min: number }
    | { readonly type: "sheet"; readonly name: string }
  )

export interface GoalResult {
  readonly goal: Goal
  readonly ok: boolean
  /** What the student sees in the task list. */
  readonly text: string
  /** Shown only when the condition is not met. */
  readonly hint: string
}

const listOf = (cells: Cells): ReadonlyArray<string> => (typeof cells === "string" ? [cells] : cells)

const isOneCell = (cells: Cells): boolean => listOf(cells).length === 1 && !(listOf(cells)[0] ?? "").includes(":")

const cellsLabel = (cells: Cells): string => `${isOneCell(cells) ? "клітинці" : "клітинках"} ${listOf(cells).join(", ")}`

const cellsLabelNom = (cells: Cells): string => `${isOneCell(cells) ? "Клітинка" : "Клітинки"} ${listOf(cells).join(", ")}`

export const formatValue = (value: CellValue): string => {
  if (value === null) return "порожньо"
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE"
  if (typeof value === "number") return String(Math.round(value * 1e9) / 1e9).replace(".", ",")
  return `«${value}»`
}

const STYLE_WORDS: ReadonlyArray<[keyof CellStyle, (s: CellStyle) => string]> = [
  ["bold", () => "жирний шрифт"],
  ["italic", () => "курсив"],
  ["underline", () => "підкреслення"],
  ["strike", () => "закреслення"],
  ["color", () => "колір тексту"],
  ["fill", () => "колір заливки"],
  ["align", (s) => ({ left: "вирівнювання ліворуч", center: "вирівнювання по центру", right: "вирівнювання праворуч" })[s.align ?? "left"]],
  ["wrap", () => "перенесення тексту"],
  ["fontSize", (s) => `розмір шрифту ${s.fontSize}`],
  ["format", (s) => `формат чисел ${s.format}`]
]

const styleWords = (style: CellStyle): string =>
  STYLE_WORDS.filter(([key]) => style[key] !== undefined && style[key] !== false)
    .map(([, word]) => word(style))
    .join(", ")

/** Default wording of a goal for the task list. */
export const describeGoal = (goal: Goal): string => {
  if (goal.text !== undefined) return goal.text
  switch (goal.type) {
    case "value":
      return typeof goal.equals === "object" && goal.equals !== null
        ? `У ${cellsLabel(goal.cells)} правильні значення`
        : `У ${cellsLabel(goal.cells)} значення ${formatValue(goal.equals)}`
    case "formula":
      return `У ${cellsLabel(goal.cells)} ${isOneCell(goal.cells) ? "формула" : "формули"}${goal.functions?.length ? ` з функцією ${goal.functions.join(", ")}` : ""}`
    case "recalc":
      return `Формули в ${cellsLabel(goal.cells)} перераховуються, коли змінюються дані`
    case "style":
      return `${cellsLabelNom(goal.cells)}: ${styleWords(goal.style)}`
    case "filled":
      return `${cellsLabelNom(goal.cells)} заповнено`
    case "sorted":
      return `Рядки ${goal.range} упорядковано за стовпцем ${goal.by} ${goal.order === "desc" ? "за спаданням" : "за зростанням"}`
    case "width":
      return `Стовпець ${goal.column} досить широкий, щоб усе було видно`
    case "sheet":
      return `Є аркуш «${goal.name}»`
  }
}

const sameValue = (actual: CellValue, expected: CellValue, tolerance = 0): boolean => {
  if (typeof expected === "number") {
    if (typeof actual !== "number") return false
    return Math.abs(actual - expected) <= Math.max(tolerance, 1e-9 * Math.max(1, Math.abs(expected)))
  }
  if (typeof expected === "string") return typeof actual === "string" && actual.trim().toLowerCase() === expected.trim().toLowerCase()
  return actual === expected
}

const expectedAt = (equals: CellValue | ReadonlyArray<CellValue>, index: number): CellValue =>
  Array.isArray(equals) ? ((equals as ReadonlyArray<CellValue>)[index] ?? null) : (equals as CellValue)

/** The first cell whose value is wrong, as a hint; `null` when all are right. */
const wrongValue = (
  computed: Computed,
  goal: Goal & { readonly cells: Cells; readonly equals: CellValue | ReadonlyArray<CellValue>; readonly tolerance?: number }
): string | null => {
  const cells = cellsIn(goal.cells)
  for (const [i, cell] of cells.entries()) {
    const actual = computed.value(cell, goal.sheet)
    if (!sameValue(actual, expectedAt(goal.equals, i), goal.tolerance)) return `У ${cell} зараз ${formatValue(actual)}.`
  }
  return cells.length === 0 ? "Завдання вказує неправильні клітинки." : null
}

const wrongFormula = (book: WorkbookState, goal: Goal & { readonly type: "formula" }): string | null => {
  const sheet = findSheet(book, goal.sheet)
  for (const cell of cellsIn(goal.cells)) {
    const input = cellOf(sheet, cell)?.input
    if (input === undefined || input === "") return `Клітинка ${cell} порожня.`
    if (!isFormula(input)) return `У ${cell} записано значення, а потрібна формула. Формула починається зі знака =.`
    if (goal.refs !== false && refsIn(input).size === 0) return `Формула в ${cell} не використовує адрес клітинок, тому не перерахується, коли зміняться дані.`
    const used = functionsIn(input)
    const missing = (goal.functions ?? []).find((f) => !used.has(f.toUpperCase()))
    if (missing !== undefined) return `У формулі в ${cell} немає функції ${missing}.`
  }
  return null
}

/** In a style goal, `color: "*"` or `fill: "*"` accepts any color the student chose. */
export const ANY = "*"

const wrongStyle = (book: WorkbookState, goal: Goal & { readonly type: "style" }): string | null => {
  const sheet = findSheet(book, goal.sheet)
  for (const cell of cellsIn(goal.cells)) {
    const style = cellOf(sheet, cell)?.style ?? {}
    for (const key of Object.keys(goal.style) as Array<keyof CellStyle>) {
      const want = goal.style[key]
      const have = style[key] ?? (typeof want === "boolean" ? false : undefined)
      const same =
        want === ANY ? have !== undefined : typeof want === "string" && typeof have === "string" ? want.toLowerCase() === have.toLowerCase() : want === have
      if (!same) return `У ${cell} ще немає: ${styleWords({ [key]: want })}.`
    }
  }
  return null
}

const compareCells = (a: CellValue, b: CellValue): number => {
  if (typeof a === "number" && typeof b === "number") return a - b
  if (a === null) return b === null ? 0 : 1
  if (b === null) return -1
  if (typeof a === "number") return -1
  if (typeof b === "number") return 1
  return String(a).localeCompare(String(b), "uk")
}

const rowsOf = (computed: Computed, range: string, sheet: string | undefined): ReadonlyArray<ReadonlyArray<CellValue>> => {
  const cells = cellsIn(range)
  const columns = new Set(cells.map(columnOf)).size
  const rows: CellValue[][] = []
  cells.forEach((cell, i) => {
    if (i % columns === 0) rows.push([])
    rows.at(-1)?.push(computed.value(cell, sheet))
  })
  return rows
}

const rowKey = (row: ReadonlyArray<CellValue>): string => JSON.stringify(row)

const wrongOrder = (start: Computed, final: Computed, goal: Goal & { readonly type: "sorted" }): string | null => {
  const firstCol = columnOf(goal.range.split(":")[0] ?? "")
  const columns = [...new Set(cellsIn(goal.range).map(columnOf))]
  const by = columns.indexOf(goal.by.toUpperCase())
  if (by < 0 || firstCol === "") return "Завдання вказує стовпець поза таблицею."
  const rows = rowsOf(final, goal.range, goal.sheet)
  const sign = goal.order === "desc" ? -1 : 1
  for (let i = 1; i < rows.length; i++) {
    if (sign * compareCells(rows[i - 1]?.[by] ?? null, rows[i]?.[by] ?? null) > 0) return `Рядок ${i + 1} таблиці стоїть не на своєму місці.`
  }
  const before = rowsOf(start, goal.range, goal.sheet).map(rowKey).sort()
  const after = rows.map(rowKey).sort()
  if (before.join("|") !== after.join("|")) return "Дані в рядках перемішалися: упорядковуй усю таблицю, а не один стовпець."
  return null
}

/** Default Univer column width; a goal on width counts a column the student never touched as this wide. */
export const DEFAULT_WIDTH = 88

/** Checks every goal on the final table. `start` is the task's start table (for goals that compare with it). */
export const checkGoals = async (start: WorkbookState, final: WorkbookState, goals: ReadonlyArray<Goal>): Promise<ReadonlyArray<GoalResult>> => {
  const computed = await compute(final)
  const needsStart = goals.some((g) => g.type === "sorted")
  const startComputed = needsStart ? await compute(start) : computed
  const results: GoalResult[] = []
  for (const goal of goals) {
    const problem = await problemOf(goal, final, computed, startComputed)
    results.push({ goal, ok: problem === null, text: describeGoal(goal), hint: goal.hint ?? problem ?? "" })
  }
  return results
}

const problemOf = async (goal: Goal, final: WorkbookState, computed: Computed, startComputed: Computed): Promise<string | null> => {
  switch (goal.type) {
    case "value":
      return wrongValue(computed, goal)
    case "formula":
      return wrongFormula(final, goal)
    case "recalc": {
      const formulas = wrongFormula(final, { type: "formula", cells: goal.cells, ...(goal.sheet === undefined ? {} : { sheet: goal.sheet }) })
      if (formulas !== null) return formulas
      const changed = await compute(withInputs(final, goal.sheet, goal.set))
      const wrong = wrongValue(changed, goal)
      const data = Object.entries(goal.set)
        .map(([cell, v]) => `${cell} = ${formatValue(v as CellValue)}`)
        .join(", ")
      return wrong === null ? null : `Якщо ${data}, формула дає неправильний результат. ${wrong}`
    }
    case "style":
      return wrongStyle(final, goal)
    case "filled": {
      const empty = cellsIn(goal.cells).find((cell) => computed.value(cell, goal.sheet) === null)
      return empty === undefined ? null : `Клітинка ${empty} порожня.`
    }
    case "sorted":
      return wrongOrder(startComputed, computed, goal)
    case "width": {
      const sheet = findSheet(final, goal.sheet)
      const width = sheet?.widths?.[goal.column.toUpperCase()] ?? DEFAULT_WIDTH
      return width >= goal.min ? null : `Розшир стовпець ${goal.column}: перетягни праву межу його заголовка.`
    }
    case "sheet":
      return final.sheets.some((s) => s.name.trim() === goal.name) ? null : `Аркуша «${goal.name}» немає. Двічі клацни на назві аркуша внизу, щоб її змінити.`
  }
}

export const allMet = (results: ReadonlyArray<GoalResult>): boolean => results.length > 0 && results.every((r) => r.ok)
