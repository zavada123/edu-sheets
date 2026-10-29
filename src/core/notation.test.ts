import { describe, expect, it } from "vitest"
import { ukrainianFormula, ukrainianNumber } from "./notation.ts"

describe("Ukrainian notation", () => {
  it("reads a decimal comma in a number", () => {
    expect([ukrainianNumber("2,5"), ukrainianNumber(" -0,75 "), ukrainianNumber("2.5"), ukrainianNumber("2,5 кг")]).toEqual([2.5, -0.75, null, null])
  })

  it("turns ; into , and decimal commas into dots", () => {
    expect(ukrainianFormula('=IF(A1>2,5;"так, звісно";"ні")')).toBe('=IF(A1>2.5,"так, звісно","ні")')
    expect(ukrainianFormula("=ROUND(B2;1)")).toBe("=ROUND(B2,1)")
  })

  it("keeps English notation", () => {
    expect(ukrainianFormula("=SUM(A1,B1)")).toBe("=SUM(A1,B1)")
    expect(ukrainianFormula("=ROUND(2,5)")).toBe("=ROUND(2,5)")
    expect(ukrainianFormula("=A1*2,5")).toBe("=A1*2.5")
  })
})
