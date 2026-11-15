import { CommandType } from "@univerjs/core"
import { useEffect, useState } from "react"
import { checkGoals } from "../../core/goals.ts"
import type { WorkbookState } from "../../core/workbook.ts"
import type { GuideStep } from "../../scenarios/types.ts"
import { readWorkbook, type SheetsAPI } from "../univer-bridge.ts"
import { isOpen, lockCss, openCommands, sameRange, stepTab } from "./guide-rules.ts"
import { type Box, openTab, sameBox, targetBox, visibleBox } from "./target-rect.ts"

/** Typing fires many changes; the step's condition is checked once the student pauses. */
const GOAL_DELAY_MS = 300

/** Where the guide is now: the step, the box to light and the trainer area to shade around it. */
export interface GuideView {
  readonly index: number
  readonly target: Box | null
  readonly area: Box | null
}

interface Options {
  readonly api: SheetsAPI | null
  /** The trainer's sheet area: Univer lives inside it, the shade covers it. */
  readonly sheet: HTMLElement | null
  readonly steps: ReadonlyArray<GuideStep>
  readonly on: boolean
  /** The table at the start of the exercise: goals compare the student's table with it. */
  readonly start: WorkbookState
}

const isButtonCommand = (id: string): boolean => document.querySelector(`[data-u-command="${id.replace(/["\\]/g, "\\$&")}"]`) !== null

const activeRange = (api: SheetsAPI): string | null => api.getActiveWorkbook()?.getActiveSheet().getSelection()?.getActiveRange()?.getA1Notation() ?? null

/**
 * Runs a guide over one Univer: closes the buttons a step does not need (they turn grey and their shortcuts do
 * nothing), follows the step's target on the screen and moves on when the step is done. A new Univer (another
 * exercise, «Почати спочатку») starts the guide from the first step.
 */
export const useGuide = ({ api, sheet, steps, on, start }: Options): GuideView => {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState<SheetsAPI | null>(api)
  if (shown !== api) {
    setShown(api)
    setIndex(0)
  }
  const [target, setTarget] = useState<Box | null>(null)
  const [area, setArea] = useState<Box | null>(null)
  const step = on ? steps[index] : undefined

  useEffect(() => {
    if (api === null || sheet === null || step === undefined) {
      setTarget(null)
      setArea(null)
      return
    }
    const open = openCommands(step)
    const style = document.createElement("style")
    style.dataset.esGuide = ""
    style.textContent = lockCss(open, stepTab(step))
    document.head.append(style)

    let finished = false
    const next = () => {
      if (finished) return
      finished = true
      setIndex((i) => i + 1)
    }
    const done = step.done
    let timer: ReturnType<typeof setTimeout> | undefined
    const checkGoal = () => {
      if (!("goal" in done)) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        void checkGoals(start, readWorkbook(api), [done.goal]).then((found) => {
          if (found.every((r) => r.ok)) next()
        })
      }, GOAL_DELAY_MS)
    }
    const checkSelection = () => {
      if (!("select" in done)) return
      const range = activeRange(api)
      if (range !== null && sameRange(range, done.select)) next()
    }

    // Shortcuts and context menus run the same commands as the buttons: a closed button's command does nothing.
    const blocker = api.addEvent(api.Event.BeforeCommandExecute, (event) => {
      if (event.type === CommandType.COMMAND && !isOpen(event.id, open) && isButtonCommand(event.id)) event.cancel = true
    })
    const watcher = api.addEvent(api.Event.CommandExecuted, (event) => {
      if ("command" in done && event.id === done.command) next()
      else if (event.type === CommandType.MUTATION) checkGoal()
      else if (event.id === "sheet.operation.set-selections") checkSelection()
    })

    // The target moves with scrolling, resizing and the ribbon folding: follow it every frame.
    let frame = 0
    const follow = () => {
      const box = step.target === undefined ? null : targetBox(sheet, api, step.target)
      setTarget((old) => (sameBox(old, box) ? old : box))
      const sheetBox = visibleBox(sheet)
      setArea((old) => (sameBox(old, sheetBox) ? old : sheetBox))
      if ("tab" in done && openTab(sheet) === done.tab) next()
      frame = requestAnimationFrame(follow)
    }
    follow()
    // The student may have done the step already (a selection made before, a step done ahead).
    checkGoal()
    checkSelection()

    return () => {
      finished = true
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      blocker.dispose()
      watcher.dispose()
      style.remove()
    }
  }, [api, sheet, step, start])

  return { index, target: on ? target : null, area: on ? area : null }
}
