import { cellName, parseCell } from "../../core/address.ts"
import type { GuideStep } from "../../scenarios/types.ts"

/** Undo and redo always work: a student who pressed the wrong thing takes it back. */
export const ALWAYS_OPEN: ReadonlyArray<string> = ["univer.command.undo", "univer.command.redo"]

/** Commands the student may use in a step: its own list, the target button, undo and redo. */
export const openCommands = (step: GuideStep): ReadonlyArray<string> => {
  const target = step.target !== undefined && "command" in step.target ? [step.target.command] : []
  return [...ALWAYS_OPEN, ...target, ...(step.open ?? [])]
}

/** `"sheet.command.numfmt.*"` opens every command with that start; any other entry opens one command. */
export const isOpen = (id: string, open: ReadonlyArray<string>): boolean =>
  open.some((entry) => (entry.endsWith("*") ? id.startsWith(entry.slice(0, -1)) : id === entry))

/** The ribbon tab a step needs: the one it points at or waits for. */
export const stepTab = (step: GuideStep): string | undefined => {
  if (step.target !== undefined && "tab" in step.target) return step.target.tab
  return "tab" in step.done ? step.done.tab : undefined
}

const quoted = (text: string): string => `"${text.replace(/["\\]/g, "\\$&")}"`

const openSelector = (entry: string): string =>
  entry.endsWith("*") ? `[data-u-command^=${quoted(entry.slice(0, -1))}]` : `[data-u-command=${quoted(entry)}]`

/**
 * The stylesheet that greys out the closed buttons. Univer draws its menus outside the trainer (in `body`), so the
 * rules are not scoped to the trainer; they live only while a guide step runs. Tabs other than the open one (or the one
 * the step needs) are closed too.
 */
export const lockCss = (open: ReadonlyArray<string>, tab: string | undefined): string => {
  const keep = open.map((entry) => `:not(${openSelector(entry)})`).join("")
  const tabKeep = tab === undefined ? "" : `:not([title=${quoted(tab)}])`
  const closed = "opacity: 0.3 !important; filter: grayscale(1); pointer-events: none !important; cursor: default;"
  return [
    `[data-u-command]${keep} { ${closed} }`,
    `[data-u-comp="ribbon-header-menu"] [role="tab"]:not([aria-selected="true"])${tabKeep} { ${closed} }`
  ].join("\n")
}

/** The first and last cell of `"A1:C1"` or `"B2"`, upper case and without `$`; `null` for a wrong address. */
export const rangeCorners = (range: string): { readonly first: string; readonly last: string } | null => {
  const [from = "", to = from] = range.split(":")
  const a = parseCell(from)
  const b = parseCell(to)
  if (a === null || b === null) return null
  const first = { row: Math.min(a.row, b.row), col: Math.min(a.col, b.col) }
  const last = { row: Math.max(a.row, b.row), col: Math.max(a.col, b.col) }
  return { first: cellName(first), last: cellName(last) }
}

/** `"a1:c1"` is the same range as `"A1:C1"`, and `"B2"` as `"B2:B2"`. */
export const sameRange = (a: string, b: string): boolean => {
  const x = rangeCorners(a)
  const y = rangeCorners(b)
  return x !== null && y !== null && x.first === y.first && x.last === y.last
}
