import { describe, expect, it } from "vitest"
import { checkGoals } from "../core/goals.ts"
import { grade } from "../core/grade.ts"
import { rangeCorners } from "../ui/guide/guide-rules.ts"
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

  for (const scenario of scenarios.filter((s) => s.guide !== undefined)) {
    const steps = scenario.guide ?? []

    it(`${scenario.id}: every guide step names real cells`, () => {
      const ranges = steps.flatMap((step) => [
        ...(step.target !== undefined && "cells" in step.target ? [step.target.cells] : []),
        ...("select" in step.done ? [step.done.select] : [])
      ])
      expect(ranges.filter((range) => rangeCorners(range) === null)).toEqual([])
    })

    it(`${scenario.id}: the reference solution meets every guide step`, async () => {
      const goals = steps.flatMap((step) => ("goal" in step.done ? [step.done.goal] : []))
      const found = await checkGoals(buildWorkbook(scenario.start), referenceWorkbook(scenario), goals)
      expect(found.filter((r) => !r.ok).map((r) => r.text)).toEqual([])
    })
  }
})
