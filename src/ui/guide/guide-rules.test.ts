import { describe, expect, it } from "vitest"
import { isOpen, lockCss, openCommands, rangeCorners, sameRange, stepTab } from "./guide-rules.ts"

describe("isOpen", () => {
  it("opens an exact command id", () => {
    expect(isOpen("sheet.command.set-range-bold", ["sheet.command.set-range-bold"])).toBe(true)
    expect(isOpen("sheet.command.set-range-italic", ["sheet.command.set-range-bold"])).toBe(false)
  })

  it("opens every command with the start of an entry ending in *", () => {
    expect(isOpen("sheet.command.numfmt.set.percent", ["sheet.command.numfmt.*"])).toBe(true)
    expect(isOpen("sheet.command.set-range-bold", ["sheet.command.numfmt.*"])).toBe(false)
  })
})

describe("openCommands", () => {
  it("adds the target button, undo and redo to the step's own list", () => {
    const open = openCommands({ text: "", target: { command: "sheet.command.set-range-bold" }, open: ["x.y"], done: { command: "z" } })
    expect(open).toEqual(["univer.command.undo", "univer.command.redo", "sheet.command.set-range-bold", "x.y"])
  })

  it("opens only undo and redo when the step points at cells", () => {
    expect(openCommands({ text: "", target: { cells: "A1" }, done: { select: "A1" } })).toEqual(["univer.command.undo", "univer.command.redo"])
  })
})

describe("stepTab", () => {
  it("takes the tab the step points at or waits for", () => {
    expect(stepTab({ text: "", target: { tab: "Дані" }, done: { command: "x" } })).toBe("Дані")
    expect(stepTab({ text: "", done: { tab: "Вигляд" } })).toBe("Вигляд")
    expect(stepTab({ text: "", done: { command: "x" } })).toBeUndefined()
  })
})

describe("lockCss", () => {
  it("greys out every button except the open ones", () => {
    const css = lockCss(["a.b", "c.*"], undefined)
    expect(css).toContain('[data-u-command]:not([data-u-command="a.b"]):not([data-u-command^="c."])')
    expect(css).toContain("pointer-events: none")
  })

  it("keeps the open tab and the tab the step needs", () => {
    expect(lockCss([], "Дані")).toContain('[role="tab"]:not([aria-selected="true"]):not([title="Дані"])')
  })

  it("escapes quotes in ids", () => {
    expect(lockCss(['a"b'], undefined)).toContain('[data-u-command="a\\"b"]')
  })
})

describe("ranges", () => {
  it("finds the corners of a range in any order and case", () => {
    expect(rangeCorners("c3:a1")).toEqual({ first: "A1", last: "C3" })
    expect(rangeCorners("$B$2")).toEqual({ first: "B2", last: "B2" })
    expect(rangeCorners("nonsense")).toBeNull()
  })

  it("compares ranges by their cells", () => {
    expect(sameRange("a1:c1", "A1:C1")).toBe(true)
    expect(sameRange("B2", "B2:B2")).toBe(true)
    expect(sameRange("A1:C1", "A1:B1")).toBe(false)
  })
})
