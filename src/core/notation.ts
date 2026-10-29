/**
 * Ukrainian Excel writes `2,5` for a decimal number and `;` between function arguments: `=IF(A1>1;"так";"ні")`.
 * The Univer engine reads `2.5` and `,`. These functions turn what a student typed into what the engine reads,
 * so the textbook notation works.
 */

const NUMBER_WITH_COMMA = /^\s*([+-]?\d+),(\d+)\s*$/

/** `"2,5"` → `2.5`; `null` for anything else. */
export const ukrainianNumber = (text: string): number | null => {
  const m = NUMBER_WITH_COMMA.exec(text)
  return m === null ? null : Number(`${m[1]}.${m[2]}`)
}

/** Commas between digits outside any brackets: `=A1*2,5`. Inside brackets a comma may separate arguments: `=ROUND(2,5)`. */
const topLevelDecimals = (code: string): string => {
  let depth = 0
  let out = ""
  for (let i = 0; i < code.length; i++) {
    const ch = code[i] ?? ""
    if (ch === "(") depth++
    if (ch === ")") depth--
    const decimal = ch === "," && depth === 0 && /\d/.test(code[i - 1] ?? "") && /\d/.test(code[i + 1] ?? "")
    out += decimal ? "." : ch
  }
  return out
}

/**
 * `=IF(A1>2,5;1;0)` → `=IF(A1>2.5,1,0)`. Text in quotes is left as it is.
 * A formula with `;` is in the Ukrainian notation: every comma between digits is decimal.
 * A formula without `;` (`=SUM(A1,B1)`) keeps its commas, except a decimal comma outside brackets (`=A1*2,5`).
 */
export const ukrainianFormula = (formula: string): string => {
  if (!formula.startsWith("=")) return formula
  // Odd parts are text in quotes.
  const parts = formula.split(/("[^"]*")/)
  const ukrainian = parts.some((part, i) => i % 2 === 0 && part.includes(";"))
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return part
      return ukrainian ? part.replace(/(\d),(\d)/g, "$1.$2").replace(/;/g, ",") : topLevelDecimals(part)
    })
    .join("")
}
