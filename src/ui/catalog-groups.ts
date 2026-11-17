import { TOPIC_NAMES, type Scenario, type ScenarioTopic } from "../scenarios/types.ts"

/** The topic of an exercise: the catalog puts one without a topic under the first formulas. */
export const topicOf = (scenario: Scenario): ScenarioTopic => scenario.topic ?? "formulas"

export const topicName = (scenario: Scenario): string => TOPIC_NAMES[topicOf(scenario)]

/** Exercises of one topic, in library order, and how many of them are solved. */
export interface TopicGroup {
  readonly topic: ScenarioTopic
  readonly items: ReadonlyArray<Scenario>
  readonly done: number
}

const TOPIC_ORDER: ReadonlyArray<ScenarioTopic> = ["formulas", "format", "functions", "references", "logic", "data"]

/** Exercises grouped by topic, in the order of `TOPIC_NAMES`, empty topics left out; `solved` gives the count of each group. */
export const topicGroups = (scenarios: ReadonlyArray<Scenario>, solved: ReadonlyArray<string>): ReadonlyArray<TopicGroup> =>
  TOPIC_ORDER.flatMap((topic) => {
    const items = scenarios.filter((s) => topicOf(s) === topic)
    return items.length === 0 ? [] : [{ topic, items, done: items.filter((s) => solved.includes(s.id)).length }]
  })

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
