import { describe, expect, it } from "vitest"
import { cellsOf, colIndex, colName, functionsIn, parseCell, refsIn } from "./address.ts"

describe("addresses", () => {
  it("converts columns", () => {
    expect([colIndex("A"), colIndex("z"), colIndex("AA"), colName(0), colName(25), colName(26), colName(701)]).toEqual([0, 25, 26, "A", "Z", "AA", "ZZ"])
  })

  it("parses cells with $", () => {
    expect([parseCell("$B$2"), parseCell("b10"), parseCell("B0"), parseCell("Аркуш")]).toEqual([{ row: 1, col: 1 }, { row: 9, col: 1 }, null, null])
  })

  it("opens ranges", () => {
    expect(cellsOf("B2:C3")).toEqual(["B2", "C2", "B3", "C3"])
  })

  it("finds references and functions, but not in text", () => {
    expect([...refsIn('=SUM(B2:B4)*$C$1+LOG10(A1)&"D5"')]).toEqual(["B2", "B3", "B4", "C1", "A1"])
    expect([...functionsIn('=sum(B2:B4)+Max(C1,2)&"IF("')]).toEqual(["SUM", "MAX"])
  })
})
