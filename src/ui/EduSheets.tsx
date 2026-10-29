import { CommandType } from "@univerjs/core"
import { UniverSheetsConditionalFormattingPreset } from "@univerjs/preset-sheets-conditional-formatting"
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core"
import { UniverSheetsFilterPreset } from "@univerjs/preset-sheets-filter"
import { UniverSheetsSortPreset } from "@univerjs/preset-sheets-sort"
import { createUniver } from "@univerjs/presets"
import { useCallback, useEffect, useRef, useState } from "react"
import { checkGoals, type GoalResult } from "../core/goals.ts"
import { toUniverData } from "../core/univer-data.ts"
import { buildWorkbook, type WorkbookState } from "../core/workbook.ts"
import type { Scenario } from "../scenarios/types.ts"
import { UK_LOCALE, ukLocales } from "./locale/index.ts"
import { TaskPanel } from "./TaskPanel.tsx"
import { isTouchDevice, keepKeyboardForEditing } from "./touch-keyboard.ts"
import { fixUkrainianInput, readWorkbook, type SheetsAPI } from "./univer-bridge.ts"
import "@univerjs/preset-sheets-core/lib/index.css"
import "@univerjs/preset-sheets-sort/lib/index.css"
import "@univerjs/preset-sheets-filter/lib/index.css"
import "@univerjs/preset-sheets-conditional-formatting/lib/index.css"
import "./sheets.css"

/** Protection belongs to shared documents with owners; a student's own table has none. */
const HIDDEN_MENUS = {
  "sheet.command.add-range-protection-from-toolbar": { hidden: true },
  "sheet.contextMenu.permission": { hidden: true }
}

/** Typing fires many changes; the page hears about the table once the student pauses. */
const CHANGE_DELAY_MS = 400

interface Props {
  /** To show another scenario, give the component a new `key`, for example the scenario id. */
  readonly scenario: Scenario
  /** Called after every check; `solved` is true when all conditions are met. */
  readonly onCheck?: (solved: boolean) => void
  /**
   * Called with the whole table each time the student changes it. A page that checks answers on its server
   * sends this table and grades it there with `grade` from the core.
   */
  readonly onChange?: (workbook: WorkbookState) => void
  /** A table saved earlier: the trainer starts with it instead of the scenario start. */
  readonly initialWorkbook?: WorkbookState
  /** `false` hides «Перевірити» when the page checks the answer itself. */
  readonly selfCheck?: boolean
}

/** The spreadsheet trainer for one scenario. Can be embedded into any React page. */
export const EduSheets = ({ scenario, onCheck, onChange, initialWorkbook, selfCheck = true }: Props) => {
  const host = useRef<HTMLDivElement>(null)
  const api = useRef<SheetsAPI | null>(null)
  const [results, setResults] = useState<ReadonlyArray<GoalResult> | null>(null)
  const [checking, setChecking] = useState(false)
  const [taskOpen, setTaskOpen] = useState(true)
  // A new value builds the table again from the scenario start («Почати спочатку»).
  const [round, setRound] = useState(0)

  // Refs, so a new callback on every render of the page does not rebuild the table.
  const changed = useRef(onChange)
  changed.current = onChange
  const checked = useRef(onCheck)
  checked.current = onCheck
  const initial = useRef(initialWorkbook)

  useEffect(() => {
    if (host.current === null) return
    // Each Univer gets its own box: the old one is disposed a moment later and must not clear the new one.
    const container = document.createElement("div")
    container.className = "es-univer"
    host.current.append(container)
    const { univer, univerAPI } = createUniver({
      locale: UK_LOCALE,
      locales: ukLocales,
      presets: [
        UniverSheetsCorePreset({ container, menu: HIDDEN_MENUS }),
        UniverSheetsSortPreset(),
        UniverSheetsFilterPreset(),
        UniverSheetsConditionalFormattingPreset()
      ]
    })
    const start = round === 0 && initial.current !== undefined ? initial.current : buildWorkbook(scenario.start)
    univerAPI.createWorkbook(toUniverData(start))
    api.current = univerAPI

    let timer: ReturnType<typeof setTimeout> | undefined
    // Univer runs some mutations of its own while it starts; the page hears only about real changes of the table.
    let last = JSON.stringify(readWorkbook(univerAPI))
    const report = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const table = readWorkbook(univerAPI)
        const text = JSON.stringify(table)
        if (text === last) return
        last = text
        changed.current?.(table)
      }, CHANGE_DELAY_MS)
    }
    const onCommand = univerAPI.addEvent(univerAPI.Event.CommandExecuted, (event) => {
      if (event.type !== CommandType.MUTATION) return
      setResults(null)
      report()
    })
    const onEditEnd = univerAPI.addEvent(univerAPI.Event.SheetEditEnded, (event) => {
      if (!event.isConfirm) return
      const sheetId = event.worksheet.getSheetId()
      // After Univer has written the cell: a change inside the edit would be overwritten.
      setTimeout(() => fixUkrainianInput(univerAPI, sheetId, event.row, event.column), 0)
    })
    const keyboard = isTouchDevice() ? keepKeyboardForEditing(univerAPI, container) : null
    return () => {
      clearTimeout(timer)
      onCommand.dispose()
      onEditEnd.dispose()
      keyboard?.dispose()
      api.current = null
      // Univer renders with its own React root; unmounting it while this page renders breaks React.
      setTimeout(() => {
        univer.dispose()
        container.remove()
      }, 0)
    }
  }, [scenario, round])

  const check = useCallback(async () => {
    const current = api.current
    if (current === null) return
    setChecking(true)
    try {
      const found = await checkGoals(buildWorkbook(scenario.start), readWorkbook(current), scenario.goals)
      setResults(found)
      checked.current?.(found.length > 0 && found.every((r) => r.ok))
    } finally {
      setChecking(false)
    }
  }, [scenario])

  const reset = useCallback(() => {
    setResults(null)
    setRound((n) => n + 1)
  }, [])

  return (
    <div className="es-root">
      <div className="es-body">
        <TaskPanel
          scenario={scenario}
          results={results}
          open={taskOpen}
          checking={checking}
          selfCheck={selfCheck}
          onToggle={() => setTaskOpen((v) => !v)}
          onCheck={() => void check()}
          onReset={reset}
        />
        <div className="es-sheet" ref={host} />
      </div>
    </div>
  )
}
