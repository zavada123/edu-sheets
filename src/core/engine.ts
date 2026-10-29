import {
  CellValueType,
  ICommandService,
  type IWorkbookData,
  IUniverInstanceService,
  LifecycleService,
  LifecycleStages,
  LocaleType,
  Univer,
  UniverInstanceType,
  type Workbook
} from "@univerjs/core"
import { FormulaCalculationSessionService, SetTriggerFormulaCalculationStartMutation, UniverFormulaEnginePlugin } from "@univerjs/engine-formula"
import { UniverSheetsPlugin } from "@univerjs/sheets"
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula"
import { parseCell } from "./address.ts"
import { toUniverData } from "./univer-data.ts"
import type { CellValue, Computed } from "./compute.ts"
import type { WorkbookState } from "./workbook.ts"

/** A formula that never finishes is an error, not a hung server. */
const TIMEOUT_MS = 5_000
const DISPOSE_DELAY_MS = 1_000

/** Instances live a moment after their run; each gets its own workbook id. */
let runs = 0

/**
 * Computes every formula of the workbook with the Univer formula engine, without a page.
 * The same engine computes the table the student sees, so the results match.
 */
export const computeNow = async (workbook: WorkbookState): Promise<Computed> => {
  const univer = new Univer({ locale: LocaleType.EN_US, locales: { [LocaleType.EN_US]: {} } })
  try {
    univer.registerPlugin(UniverFormulaEnginePlugin, { notExecuteFormula: false })
    univer.registerPlugin(UniverSheetsPlugin)
    univer.registerPlugin(UniverSheetsFormulaPlugin)
    // Services, not the facade: a page with the trainer also loads the UI facade, which needs a renderer this instance has not.
    const book = univer.createUnit<Partial<IWorkbookData>, Workbook>(UniverInstanceType.UNIVER_SHEET, toUniverData(workbook, `edu-sheets-compute-${++runs}`))
    const injector = univer.__getInjector()
    // Without a renderer a page never moves Univer past «Ready», and formulas wait for «Steady». Node moves on by itself.
    const lifecycle = injector.get(LifecycleService)
    if (lifecycle.stage < LifecycleStages.Rendered) lifecycle.stage = LifecycleStages.Rendered
    if (lifecycle.stage < LifecycleStages.Steady) lifecycle.stage = LifecycleStages.Steady
    const applied = injector.get(FormulaCalculationSessionService).waitForLatestApplied(TIMEOUT_MS)
    await injector
      .get(ICommandService)
      .executeCommand(SetTriggerFormulaCalculationStartMutation.id, { commands: [], forceCalculation: true }, { onlyLocal: true })
    await applied.catch(() => undefined)
    const values = new Map<string, CellValue>()
    const unit = injector.get(IUniverInstanceService).getUnit<Workbook>(book.getUnitId(), UniverInstanceType.UNIVER_SHEET) ?? book
    unit.getSheets().forEach((ws, index) => {
      const name = workbook.sheets[index]?.name ?? ""
      ws.getCellMatrix().forValue((row, col, cell) => {
        const v = cell?.v
        if (v === null || v === undefined || v === "") return
        // Formula results TRUE and FALSE come as 1 and 0 marked with the boolean type.
        values.set(`${name}!${row}:${col}`, cell?.t === CellValueType.BOOLEAN ? v === true || v === 1 || v === "TRUE" : (v as CellValue))
      })
    })
    const first = workbook.sheets[0]?.name ?? ""
    return {
      value: (address, sheet = first) => {
        const pos = parseCell(address)
        return pos === null ? null : (values.get(`${sheet}!${pos.row}:${pos.col}`) ?? null)
      }
    }
  } finally {
    // Some plugins finish work on the next tick and need the instance alive.
    setTimeout(() => univer.dispose(), DISPOSE_DELAY_MS)
  }
}
