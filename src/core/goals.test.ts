import { describe, expect, it } from "vitest"
import { checkGoals, type Goal } from "./goals.ts"
import { buildWorkbook, withInputs } from "./workbook.ts"

const start = buildWorkbook([{ cells: { A1: "Ціна", B1: 45, B4: 60, B5: 12 } }])
const hintOf = async (inputs: Record<string, string | number>, goal: Goal) => {
  const [result] = await checkGoals(start, withInputs(start, undefined, inputs), [goal])
  return result?.ok ? null : result?.hint
}

describe("goals", () => {
  it("formula: a typed number is not a formula", async () => {
    expect(await hintOf({ C4: 2700 }, { type: "formula", cells: "C4" })).toMatch(/потрібна формула/)
  })

  it("formula: numbers only do not count as a formula with addresses", async () => {
    expect(await hintOf({ C4: "=60*45" }, { type: "formula", cells: "C4" })).toMatch(/не використовує адрес/)
    expect(await hintOf({ C4: "=60*45" }, { type: "formula", cells: "C4", refs: false })).toBeNull()
  })

  it("formula: a missing function is named", async () => {
    expect(await hintOf({ C4: "=B4+B5" }, { type: "formula", cells: "C4", functions: ["SUM"] })).toMatch(/SUM/)
    expect(await hintOf({ C4: "=sum(B4:B5)" }, { type: "formula", cells: "C4", functions: ["SUM"] })).toBeNull()
  })

  it("value: says what the cell shows now", async () => {
    expect(await hintOf({ C4: "=B4*B2" }, { type: "value", cells: "C4", equals: 2700 })).toBe("У C4 зараз 0.")
  })

  it("recalc: a copied formula without $ fails when the rate changes", async () => {
    const goal: Goal = { type: "recalc", cells: "C5", set: { B1: 50 }, equals: 600 }
    expect(await hintOf({ C5: "=B5*45" }, goal)).toMatch(/неправильний результат/)
    expect(await hintOf({ C5: "=B5*B2" }, goal)).toMatch(/неправильний результат/)
    expect(await hintOf({ C5: "=B5*$B$1" }, goal)).toBeNull()
  })

  it("style: any fill is accepted with *", async () => {
    const book = buildWorkbook([{ cells: { A1: { input: "Ціна", style: { fill: "#ff0000", bold: true } } } }])
    const [ok] = await checkGoals(book, book, [{ type: "style", cells: "A1", style: { fill: "*", bold: true } }])
    const [bad] = await checkGoals(book, book, [{ type: "style", cells: "A1", style: { italic: true } }])
    expect([ok?.ok, bad?.ok, bad?.hint]).toEqual([true, false, "У A1 ще немає: курсив."])
  })

  it("sorted: sorting one column alone splits the rows", async () => {
    const table = buildWorkbook([{ cells: { A1: "Б", B1: 2, A2: "А", B2: 1 } }])
    const goal: Goal = { type: "sorted", range: "A1:B2", by: "B" }
    const oneColumn = withInputs(table, undefined, { B1: 1, B2: 2 })
    const whole = withInputs(table, undefined, { A1: "А", B1: 1, A2: "Б", B2: 2 })
    const [bad] = await checkGoals(table, oneColumn, [goal])
    const [ok] = await checkGoals(table, whole, [goal])
    expect([bad?.ok, bad?.hint, ok?.ok]).toEqual([false, "Дані в рядках перемішалися: упорядковуй усю таблицю, а не один стовпець.", true])
  })

  it("sheet and width", async () => {
    const book = { sheets: [{ name: "Підсумок", cells: {}, widths: { B: 200 } }] }
    const results = await checkGoals(book, book, [
      { type: "sheet", name: "Підсумок" },
      { type: "width", column: "B", min: 150 },
      { type: "width", column: "C", min: 150 }
    ])
    expect(results.map((r) => r.ok)).toEqual([true, true, false])
  })
})
