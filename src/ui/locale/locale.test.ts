import { describe, expect, it } from "vitest"
import { mergeLocales } from "@univerjs/core"
import cfEnUS from "@univerjs/preset-sheets-conditional-formatting/locales/en-US"
import coreEnUS from "@univerjs/preset-sheets-core/locales/en-US"
import filterEnUS from "@univerjs/preset-sheets-filter/locales/en-US"
import sortEnUS from "@univerjs/preset-sheets-sort/locales/en-US"
import { ukFlat } from "./uk-UA.ts"

const at = (tree: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((node, key) => (typeof node === "object" && node !== null ? (node as Record<string, unknown>)[key] : undefined), tree)

describe("Ukrainian locale", () => {
  it("translates only keys that Univer has, with the same {0} placeholders", () => {
    const en = mergeLocales(coreEnUS, sortEnUS, filterEnUS, cfEnUS)
    const problems = Object.entries(ukFlat).flatMap(([path, text]) => {
      const original = at(en, path)
      if (typeof original !== "string") return [`${path}: no such key`]
      const holes = (s: string) => (s.match(/\{\d\}/g) ?? []).sort().join()
      return holes(original) === holes(text) ? [] : [`${path}: placeholders differ`]
    })
    expect(problems).toEqual([])
  })
})
