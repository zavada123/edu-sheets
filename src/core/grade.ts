import { allMet, checkGoals, type GoalResult } from "./goals.ts"
import { buildWorkbook, parseWorkbook } from "./workbook.ts"
import type { Scenario } from "../scenarios/types.ts"

export type Grade =
  | { readonly status: "checked"; readonly solved: boolean; readonly results: ReadonlyArray<GoalResult> }
  /** The answer is not a workbook, or is larger than `LIMITS`. */
  | { readonly status: "invalid" }

/**
 * Grades a handed-in workbook on the server: every formula is computed again here,
 * so values sent by the page are never trusted.
 */
export const grade = async (scenario: Scenario, answer: unknown): Promise<Grade> => {
  const final = parseWorkbook(answer)
  if (final === null) return { status: "invalid" }
  const results = await checkGoals(buildWorkbook(scenario.start), final, scenario.goals)
  return { status: "checked", solved: allMet(results), results }
}
