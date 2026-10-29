import { describe, expect, it } from "vitest"
import { grade } from "../core/grade.ts"
import { buildWorkbook } from "../core/workbook.ts"
import { scenarios } from "./index.ts"
import { referenceWorkbook } from "./solutions.ts"

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
      const result = await grade(scenario, referenceWorkbook(scenario))
      expect(result.status === "checked" ? result.results.filter((r) => !r.ok).map((r) => `${r.text}: ${r.hint}`) : result).toEqual([])
    })
  }
})
