import { C as parseCell, i as toUniverData } from "./univer-data-B7OObZVX.js";
import { CellValueType, ICommandService, IUniverInstanceService, LifecycleService, LifecycleStages, LocaleType, Univer, UniverInstanceType } from "@univerjs/core";
import { FormulaCalculationSessionService, SetTriggerFormulaCalculationStartMutation, UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
// src/core/engine.ts
/** A formula that never finishes is an error, not a hung server. */
var TIMEOUT_MS = 5e3;
var DISPOSE_DELAY_MS = 1e3;
/** Instances live a moment after their run; each gets its own workbook id. */
var runs = 0;
/**
* Computes every formula of the workbook with the Univer formula engine, without a page.
* The same engine computes the table the student sees, so the results match.
*/
var computeNow = async (workbook) => {
	const univer = new Univer({
		locale: LocaleType.EN_US,
		locales: { [LocaleType.EN_US]: {} }
	});
	try {
		univer.registerPlugin(UniverFormulaEnginePlugin, { notExecuteFormula: false });
		univer.registerPlugin(UniverSheetsPlugin);
		univer.registerPlugin(UniverSheetsFormulaPlugin);
		const book = univer.createUnit(UniverInstanceType.UNIVER_SHEET, toUniverData(workbook, `edu-sheets-compute-${++runs}`));
		const injector = univer.__getInjector();
		const lifecycle = injector.get(LifecycleService);
		if (lifecycle.stage < LifecycleStages.Rendered) lifecycle.stage = LifecycleStages.Rendered;
		if (lifecycle.stage < LifecycleStages.Steady) lifecycle.stage = LifecycleStages.Steady;
		const applied = injector.get(FormulaCalculationSessionService).waitForLatestApplied(TIMEOUT_MS);
		await injector.get(ICommandService).executeCommand(SetTriggerFormulaCalculationStartMutation.id, {
			commands: [],
			forceCalculation: true
		}, { onlyLocal: true });
		await applied.catch(() => void 0);
		const values = /* @__PURE__ */ new Map();
		(injector.get(IUniverInstanceService).getUnit(book.getUnitId(), UniverInstanceType.UNIVER_SHEET) ?? book).getSheets().forEach((ws, index) => {
			const name = workbook.sheets[index]?.name ?? "";
			ws.getCellMatrix().forValue((row, col, cell) => {
				const v = cell?.v;
				if (v === null || v === void 0 || v === "") return;
				values.set(`${name}!${row}:${col}`, cell?.t === CellValueType.BOOLEAN ? v === true || v === 1 || v === "TRUE" : v);
			});
		});
		const first = workbook.sheets[0]?.name ?? "";
		return { value: (address, sheet = first) => {
			const pos = parseCell(address);
			return pos === null ? null : values.get(`${sheet}!${pos.row}:${pos.col}`) ?? null;
		} };
	} finally {
		setTimeout(() => univer.dispose(), DISPOSE_DELAY_MS);
	}
};
export { computeNow };
