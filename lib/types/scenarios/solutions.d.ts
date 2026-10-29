import { type CellInput, type WorkbookState } from "../core/workbook.ts";
import type { Scenario } from "./types.ts";
/** What a student types to solve each scenario (first sheet), by scenario id. Tests check that it meets every goal. */
export declare const referenceInputs: Readonly<Record<string, Readonly<Record<string, CellInput>>>>;
/** The table a student hands in when they solve the scenario: an example answer for authors and tests. */
export declare const referenceWorkbook: (scenario: Scenario) => WorkbookState;
