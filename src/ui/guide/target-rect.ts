import type { GuideTarget } from "../../scenarios/types.ts"
import type { SheetsAPI } from "../univer-bridge.ts"
import { rangeCorners } from "./guide-rules.ts"

/** A box on the screen, in viewport pixels. */
export interface Box {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

const boxOf = (rect: DOMRect): Box => ({ x: rect.x, y: rect.y, width: rect.width, height: rect.height })

const visible = (el: Element): boolean => {
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0
}

const union = (a: Box, b: Box): Box => {
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  return { x, y, width: Math.max(a.x + a.width, b.x + b.width) - x, height: Math.max(a.y + a.height, b.y + b.height) - y }
}

/** The list a button opened (alignment, borders): it is lit with the button, so the student sees what to pick. */
const openMenuOf = (button: Element): Element | null => {
  for (const menu of document.querySelectorAll('[role="menu"][data-state="open"]')) {
    const trigger = document.getElementById(menu.getAttribute("aria-labelledby") ?? "")
    if (trigger !== null && (button.contains(trigger) || trigger.contains(button)) && visible(menu)) return menu
  }
  return null
}

/** The ribbon hides the buttons that do not fit behind «⋮»; this is that button. */
const MORE_BUTTON = '[data-u-comp="ribbon-toolbar"] > div > button[data-slot="popover-trigger"]'

/**
 * Univer renders each ribbon button twice: once to measure it (hidden) and once on the ribbon or in the «⋮» menu. The
 * visible one is lit; when the button is hidden behind «⋮», the «⋮» button is lit instead.
 */
const buttonBox = (root: Element, command: string): Box | null => {
  const selector = `[data-u-command="${command.replace(/["\\]/g, "\\$&")}"]`
  const shown = [...document.querySelectorAll(selector)].find(visible)
  if (shown !== undefined) {
    const box = boxOf(shown.getBoundingClientRect())
    const menu = openMenuOf(shown)
    return menu === null ? box : union(box, boxOf(menu.getBoundingClientRect()))
  }
  const more = root.querySelector(MORE_BUTTON)
  return more !== null && visible(more) ? boxOf(more.getBoundingClientRect()) : null
}

const tabBox = (root: Element, name: string): Box | null => {
  const tab = [...root.querySelectorAll('[data-u-comp="ribbon-header-menu"] [role="tab"]')].find((el) => el.getAttribute("title") === name)
  return tab !== undefined && visible(tab) ? boxOf(tab.getBoundingClientRect()) : null
}

/** The formula bar draws on a canvas too; the sheet is the biggest one. */
const gridCanvas = (root: Element): Element | null => {
  let best: Element | null = null
  let bestArea = 0
  for (const canvas of root.querySelectorAll("canvas")) {
    const r = canvas.getBoundingClientRect()
    if (r.width * r.height > bestArea) {
      best = canvas
      bestArea = r.width * r.height
    }
  }
  return best
}

/** `getCellRect` gives one cell relative to the sheet canvas; a range is the box from its first to its last cell. */
const cellsBox = (root: Element, api: SheetsAPI, range: string): Box | null => {
  const corners = rangeCorners(range)
  const sheet = api.getActiveWorkbook()?.getActiveSheet()
  const canvas = gridCanvas(root)
  if (corners === null || sheet === undefined || sheet === null || canvas === null) return null
  const origin = canvas.getBoundingClientRect()
  const a = sheet.getRange(corners.first).getCellRect()
  const b = sheet.getRange(corners.last).getCellRect()
  return { x: origin.x + a.x, y: origin.y + a.y, width: b.x + b.width - a.x, height: b.y + b.height - a.y }
}

/** Where the target of a step is now; `null` while it is not on the screen. */
export const targetBox = (root: Element, api: SheetsAPI, target: GuideTarget): Box | null => {
  if ("command" in target) return buttonBox(root, target.command)
  if ("tab" in target) return tabBox(root, target.tab)
  return cellsBox(root, api, target.cells)
}

export const sameBox = (a: Box | null, b: Box | null): boolean =>
  a === b ||
  (a !== null &&
    b !== null &&
    Math.round(a.x) === Math.round(b.x) &&
    Math.round(a.y) === Math.round(b.y) &&
    Math.round(a.width) === Math.round(b.width) &&
    Math.round(a.height) === Math.round(b.height))

/** The part of the sheet area inside the trainer: a page may give the trainer less room than the sheet needs. */
export const visibleBox = (sheet: Element): Box => {
  const a = sheet.getBoundingClientRect()
  const b = sheet.closest(".es-root")?.getBoundingClientRect() ?? a
  const x = Math.max(a.x, b.x)
  const y = Math.max(a.y, b.y)
  return { x, y, width: Math.max(0, Math.min(a.right, b.right) - x), height: Math.max(0, Math.min(a.bottom, b.bottom) - y) }
}

/** The ribbon tab that is open now. */
export const openTab = (root: Element): string | null =>
  root.querySelector('[data-u-comp="ribbon-header-menu"] [role="tab"][aria-selected="true"]')?.getAttribute("title") ?? null
