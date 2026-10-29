import { describe, expect, it } from "vitest"
import { compute } from "./compute.ts"
import { buildWorkbook } from "./workbook.ts"

describe("compute", () => {
  it("computes formulas with cell addresses, functions and errors", async () => {
    const book = buildWorkbook([{ cells: { A1: 2, B1: 3, C1: "=A1*B1", D1: "=SUM(A1:C1)", E1: "=-5^2", F1: "=A1/0", G1: "=AVERAGE(A1:B1)", H1: "Печиво" } }])
    const c = await compute(book)
    expect([c.value("C1"), c.value("D1"), c.value("E1"), c.value("F1"), c.value("G1"), c.value("H1"), c.value("Z9")]).toEqual([
      6,
      11,
      25,
      "#DIV/0!",
      2.5,
      "Печиво",
      null
    ])
  })

  it("gives TRUE and FALSE as booleans", async () => {
    const c = await compute(buildWorkbook([{ cells: { A1: 2, B1: "=A1>1", C1: "=AND(A1>5,A1<9)", D1: true } }]))
    expect([c.value("B1"), c.value("C1"), c.value("D1")]).toEqual([true, false, true])
  })

  it("reads cells on another sheet", async () => {
    const book = buildWorkbook([{ cells: { A1: 5 } }, { name: "Підсумок", cells: { A1: "=Аркуш1!A1*2" } }])
    const c = await compute(book)
    expect(c.value("A1", "Підсумок")).toBe(10)
  })
})
