import { TOPIC_NAMES, type Scenario, type ScenarioTopic } from "../scenarios/types.ts"

/** Exercises of one grade, in library order, and how many of them are solved. */
export interface GradeGroup {
  readonly grade: number
  readonly items: ReadonlyArray<Scenario>
  readonly done: number
}

/** Exercises grouped by grade, grades ascending; `solved` gives the count of each group. */
export const gradeGroups = (scenarios: ReadonlyArray<Scenario>, solved: ReadonlyArray<string>): ReadonlyArray<GradeGroup> =>
  [...new Set(scenarios.map((s) => s.grade))]
    .sort((a, b) => a - b)
    .map((grade) => {
      const items = scenarios.filter((s) => s.grade === grade)
      return { grade, items, done: items.filter((s) => solved.includes(s.id)).length }
    })

/** The topic of an exercise: the catalog puts one without a topic under the first formulas. */
export const topicOf = (scenario: Scenario): ScenarioTopic => scenario.topic ?? "formulas"

export const topicName = (scenario: Scenario): string => TOPIC_NAMES[topicOf(scenario)]

/** Text of the catalog card: the summary, or the first step of the task. */
export const summaryOf = (scenario: Scenario): string => scenario.summary ?? scenario.task[0] ?? ""

/**
 * The exercise to open after `current`: the next unsolved one in library order, starting after `current` and going
 * round to the start; `undefined` when every other exercise is solved.
 */
export const nextScenario = (scenarios: ReadonlyArray<Scenario>, solved: ReadonlyArray<string>, current: string): Scenario | undefined => {
  const at = scenarios.findIndex((s) => s.id === current)
  const order = [...scenarios.slice(at + 1), ...scenarios.slice(0, Math.max(at, 0))]
  return order.find((s) => s.id !== current && !solved.includes(s.id))
}
