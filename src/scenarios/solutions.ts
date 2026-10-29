import { buildWorkbook, type CellInput, type CellStyle, type WorkbookState, withInputs } from "../core/workbook.ts"
import type { Scenario } from "./types.ts"

/** What a student types to solve each scenario (first sheet), by scenario id. Tests check that it meets every goal. */
export const referenceInputs: Readonly<Record<string, Readonly<Record<string, CellInput>>>> = {
  "g6-fair-cookies": { D2: "=B2*C2", D3: "=B3*C3", D4: "=B4*C4", D5: "=SUM(D2:D4)" },
  "g6-reading-marathon": { A2: 1, A3: 2, A4: 3, A5: 4, A6: 5, A7: 6, A8: 7 },
  "g6-hike-shopping": { D2: "=B2*C2", D3: "=B3*C3", D4: "=B4*C4", D5: "=B5*C5", D6: "=B6*C6", D7: "=SUM(D2:D6)", B8: "=MAX(B2:B6)" },
  "g8-trip-budget": { C4: "=B4*$B$1", C5: "=B5*$B$1", C6: "=B6*$B$1", C7: "=B7*$B$1", C8: "=SUM(C4:C7)" },
  "g8-steps-if": {
    C2: '=IF(B2>=8000,"так","ні")',
    C3: '=IF(B3>=8000,"так","ні")',
    C4: '=IF(B4>=8000,"так","ні")',
    C5: '=IF(B5>=8000,"так","ні")',
    C6: '=IF(B6>=8000,"так","ні")',
    C7: '=IF(B7>=8000,"так","ні")',
    C8: '=IF(B8>=8000,"так","ні")',
    B9: "=AVERAGE(B2:B8)"
  },
  "g8-sports-sort": {
    A2: "Дарина",
    B2: "8-В",
    C2: 190,
    A3: "Соломія",
    B3: "8-Б",
    C3: 181,
    A4: "Ярина",
    B4: "8-В",
    C4: 176,
    A5: "Остап",
    B5: "8-А",
    C5: 172,
    A6: "Марко",
    B6: "8-А",
    C6: 165,
    A7: "Богдан",
    B7: "8-Б",
    C7: 158
  }
}

/** Formatting and widths a solution needs besides the typed inputs, by scenario id. */
const referenceFormatting: Readonly<Record<string, { readonly styles: Readonly<Record<string, CellStyle>>; readonly widths: Readonly<Record<string, number>> }>> = {
  "g6-reading-marathon": {
    styles: Object.fromEntries(["A1", "B1", "C1"].map((a) => [a, { bold: true, fill: "#fff2cc", align: "center" }])),
    widths: { B: 300 }
  }
}

/** The table a student hands in when they solve the scenario: an example answer for authors and tests. */
export const referenceWorkbook = (scenario: Scenario): WorkbookState => {
  const book = withInputs(buildWorkbook(scenario.start), undefined, referenceInputs[scenario.id] ?? {})
  const extra = referenceFormatting[scenario.id]
  const [first, ...rest] = book.sheets
  if (extra === undefined || first === undefined) return book
  const cells = { ...first.cells }
  for (const [address, style] of Object.entries(extra.styles)) cells[address] = { input: cells[address]?.input ?? "", style: { ...cells[address]?.style, ...style } }
  return { sheets: [{ ...first, cells, widths: { ...first.widths, ...extra.widths } }, ...rest] }
}
