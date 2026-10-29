import { describe, expect, it } from "vitest"
import { grade } from "../core/grade.ts"
import { buildWorkbook, type WorkbookState, withInputs } from "../core/workbook.ts"
import { scenarios } from "./index.ts"
import { referenceInputs } from "./solutions.ts"

/** The marathon also needs formatting and a wider column; the inputs alone cannot do that. */
const finish = (id: string, book: WorkbookState): WorkbookState => {
  if (id !== "g6-reading-marathon") return book
  const [sheet] = book.sheets
  if (sheet === undefined) return book
  const header = { bold: true, fill: "#fff2cc", align: "center" } as const
  const cells = { ...sheet.cells }
  for (const a of ["A1", "B1", "C1"]) cells[a] = { input: cells[a]?.input ?? "", style: header }
  return { sheets: [{ ...sheet, cells, widths: { B: 300 } }] }
}

describe("scenarios", () => {
  it("have unique ids", () => {
    expect(new Set(scenarios.map((s) => s.id)).size).toBe(scenarios.length)
  })

  for (const scenario of scenarios) {
    it(`${scenario.id}: the start does not meet the goals`, async () => {
      const result = await grade(scenario, buildWorkbook(scenario.start))
      expect(result.status === "checked" && result.solved).toBe(false)
    })

    it(`${scenario.id}: the reference solution meets every goal`, async () => {
      const inputs = referenceInputs[scenario.id]
      expect(inputs).toBeDefined()
      const answer = finish(scenario.id, withInputs(buildWorkbook(scenario.start), undefined, inputs ?? {}))
      const result = await grade(scenario, answer)
      expect(result.status === "checked" ? result.results.filter((r) => !r.ok).map((r) => `${r.text}: ${r.hint}`) : result).toEqual([])
    })
  }
})
