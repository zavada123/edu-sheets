import type { Goal } from "../core/goals.ts"
import type { SheetSpec } from "../core/workbook.ts"

/** One exercise: what is in the table at the start, what to do, and how to check it. */
export interface Scenario {
  readonly id: string
  /** School grade shown on the task card; 0 hides it (a page that shows the grade itself). */
  readonly grade: number
  readonly title: string
  /** The task as the student reads it. Short sentences, one action each. */
  readonly task: ReadonlyArray<string>
  /** Sheets at the start; an empty list gives one empty «Аркуш1». */
  readonly start: ReadonlyArray<SheetSpec>
  readonly goals: ReadonlyArray<Goal>
}
