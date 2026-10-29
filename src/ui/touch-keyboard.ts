import type { SheetsAPI } from "./univer-bridge.ts"

/** Univer's hidden cell editor: it keeps focus all the time so that typing on a computer starts editing at once. */
const CELL_EDITOR = "#__editor___INTERNAL_EDITOR__DOCS_NORMAL"

/** Two taps closer than this in time and in distance are a double tap. */
const DOUBLE_TAP_MS = 400
const DOUBLE_TAP_PX = 30

/** A phone or tablet: no physical keyboard is assumed. */
export const isTouchDevice = (): boolean =>
  typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches === true

const setKeyboard = (container: HTMLElement, shown: boolean, refocus: boolean): void => {
  const editor = container.querySelector<HTMLElement>(CELL_EDITOR)
  if (editor === null) return
  editor.setAttribute("inputmode", shown ? "text" : "none")
  // The keyboard reads `inputmode` when the field gets focus, so the field is focused again.
  if (refocus && document.activeElement === editor) {
    editor.blur()
    editor.focus()
  }
}

/**
 * On a touch screen the always-focused cell editor opens the on-screen keyboard after every tap, and it covers half
 * of the table. Here the keyboard stays hidden while the student selects cells and shows up only when they edit a
 * cell (double tap). The formula bar is a separate field and opens the keyboard as usual.
 */
export const keepKeyboardForEditing = (api: SheetsAPI, container: HTMLElement): { dispose: () => void } => {
  setKeyboard(container, false, false)
  // Univer may create the editor a little later than the sheet.
  const observer = new MutationObserver(() => {
    const editor = container.querySelector(CELL_EDITOR)
    if (editor !== null && !editor.hasAttribute("inputmode")) setKeyboard(container, false, false)
  })
  observer.observe(container, { childList: true, subtree: true })
  // Mobile browsers do not always turn a double tap into `dblclick`, so the trainer opens the editor itself.
  let lastTap = { time: 0, x: 0, y: 0 }
  const onTap = (event: PointerEvent) => {
    if (event.pointerType !== "touch") return
    if (!(event.target instanceof HTMLCanvasElement) || !event.target.id.startsWith("univer-sheet-main")) return
    const isDouble =
      event.timeStamp - lastTap.time < DOUBLE_TAP_MS &&
      Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < DOUBLE_TAP_PX
    lastTap = isDouble ? { time: 0, x: 0, y: 0 } : { time: event.timeStamp, x: event.clientX, y: event.clientY }
    if (isDouble) api.getActiveWorkbook()?.startEditing()
  }
  container.addEventListener("pointerup", onTap)
  const started = api.addEvent(api.Event.SheetEditStarted, () => setKeyboard(container, true, true))
  const ended = api.addEvent(api.Event.SheetEditEnded, () => setKeyboard(container, false, true))
  return {
    dispose: () => {
      observer.disconnect()
      container.removeEventListener("pointerup", onTap)
      started.dispose()
      ended.dispose()
    }
  }
}
