import { describe, expect, it } from "vitest"
import { scenarios } from "../scenarios/index.ts"
import type { Scenario } from "../scenarios/types.ts"
import { topicGroups, nextScenario, summaryOf, topicName } from "./catalog-groups.ts"

const make = (id: string, grade: number, extra: Partial<Scenario> = {}): Scenario => ({ id, grade, title: id, task: [`Крок ${id}`], start: [], goals: [], ...extra })

describe("topicGroups", () => {
  it("groups exercises by topic in the catalog order, mixes grades, and counts the solved ones", () => {
    // Arrange
    const list = [make("a", 6, { topic: "format" }), make("b", 8, { topic: "formulas" }), make("c", 6, { topic: "formulas" })]

    // Act
    const groups = topicGroups(list, ["c"])

    // Assert
    expect(groups.map((g) => [g.topic, g.items.map((s) => s.id), g.done])).toEqual([
      ["formulas", ["b", "c"], 1],
      ["format", ["a"], 0]
    ])
  })

  it("gives every library exercise a topic, a summary and skills", () => {
    for (const s of scenarios) {
      expect(s.topic, s.id).toBeDefined()
      expect(s.summary, s.id).toBeTruthy()
      expect(s.skills?.length ?? 0, s.id).toBeGreaterThan(0)
    }
  })
})

describe("card texts", () => {
  it("falls back to the first formulas and the first task step when the exercise has no topic or summary", () => {
    const bare = make("x", 6)
    expect(topicName(bare)).toBe("Формули")
    expect(summaryOf(bare)).toBe("Крок x")
  })
})

describe("nextScenario", () => {
  const list = [make("a", 6), make("b", 6), make("c", 8)]

  it("returns the next unsolved exercise after the current one", () => {
    expect(nextScenario(list, ["b"], "a")?.id).toBe("c")
  })

  it("goes round to the start of the list", () => {
    expect(nextScenario(list, [], "c")?.id).toBe("a")
  })

  it("returns nothing when every other exercise is solved", () => {
    expect(nextScenario(list, ["a", "b"], "c")).toBeUndefined()
  })
})
